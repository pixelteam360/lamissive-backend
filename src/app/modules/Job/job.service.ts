import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma } from "@prisma/client";
import { IJobFilterRequest, TJob } from "./job.interface";
import httpStatus from "http-status";
import { jobSearchAbleFields } from "./job.costant";

const createJob = async (payload: TJob, userId: string) => {
  const result = await prisma.job.create({
    data: { ...payload, userId },
  });

  return result;
};

const getJobsFromDb = async (
  params: IJobFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.JobWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: jobSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditons: Prisma.JobWhereInput = { AND: andCondions };

  const result = await prisma.job.findMany({
    where: { ...whereConditons, status: "PENDING" },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.job.count({
    where: { ...whereConditons, status: "PENDING" },
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleJob = async (id: string) => {
  const JobProfile = await prisma.job.findUnique({
    where: { id },
    include: {
      JobApplicants: {
        select: {
          cv: true,
          status: true,
          ServiceProvider: {
            select: { id: true, image: true, fullName: true },
          },
        },
      },
    },
  });

  return JobProfile;
};

const getMyProjects = async (userId: string) => {
  const result = await prisma.job.findMany({
    where: { userId },
  });

  return result;
};

const confirmApplicant = async (
  payload: { serviceProviderId: string },
  projectId: string,
  userId: string
) => {
  const myProject = await prisma.job.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  });

  if (!myProject) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "This is not your project");
  }

  const projectApplicants = await prisma.jobApplicants.findFirst({
    where: {
      jobId: myProject.id,
      serviceProviderId: payload.serviceProviderId,
    },
    select: { id: true },
  });

  if (!projectApplicants) {
    throw new ApiError(httpStatus.NOT_FOUND, "Applicant not found");
  }

  const result = await prisma.$transaction(async (prisma) => {
    const updateProject = await prisma.job.update({
      where: { id: myProject.id },
      data: { status: "ONGOING" },
    });

    await prisma.projectApplicants.update({
      where: { id: projectApplicants.id },
      data: { status: "ACCEPTED" },
    });

    await prisma.jobApplicants.deleteMany({
      where: { jobId: myProject.id, status: { not: "ACCEPTED" } },
    });

    return updateProject;
  });

  return result;
};

export const JobService = {
  createJob,
  getJobsFromDb,
  getSingleJob,
  getMyProjects,
  confirmApplicant,
};
