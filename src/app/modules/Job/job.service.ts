import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma } from "@prisma/client";
import { IJobFilterRequest, TJob } from "./job.interface";
import httpStatus from "http-status";
import { jobSearchAbleFields } from "./job.costant";
import { sendNotification } from "../SendNotification/sendNotification";
import { Tnotification } from "../SendNotification/notificationInterface";

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
      user: {
        select: {
          Employ: { select: { fullName: true, location: true, image: true } },
        },
      },
      JobApplicants: {
        where: { status: { not: "REJECTED" } },
        select: {
          id: true,
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

const getMyJobs = async (userId: string) => {
  const result = await prisma.job.findMany({
    where: { userId },
  });

  return result;
};

const confirmApplicant = async (
  payload: { serviceProviderId: string },
  jobId: string,
  userId: string
) => {
  const myJob = await prisma.job.findFirst({
    where: { id: jobId, userId },
    select: { id: true, title: true, description: true },
  });

  if (!myJob) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "This is not your Job");
  }

  const jobApplicants = await prisma.jobApplicants.findFirst({
    where: {
      jobId: myJob.id,
      serviceProviderId: payload.serviceProviderId,
    },
    select: {
      id: true,
      ServiceProvider: { select: { user: { select: { id: true } } } },
    },
  });

  if (!jobApplicants) {
    throw new ApiError(httpStatus.NOT_FOUND, "Applicant not found");
  }

  const notificationData: Tnotification = {
    userId: jobApplicants.ServiceProvider.user.id,
    title: `Job Application accepted for ${myJob.title}`,
    body: myJob.description,
  };

  const result = await prisma.$transaction(async (prisma) => {
    const updateProject = await prisma.job.update({
      where: { id: myJob.id },
      data: { status: "ONGOING" },
    });

    await prisma.jobApplicants.update({
      where: { id: jobApplicants.id },
      data: { status: "ACCEPTED" },
    });

    await prisma.jobApplicants.deleteMany({
      where: { jobId: myJob.id, status: { not: "ACCEPTED" } },
    });

    sendNotification(notificationData);

    return updateProject;
  });

  return result;
};

const rejectApplicant = async (id: string) => {
  const result = await prisma.jobApplicants.update({
    where: { id },
    data: { status: "REJECTED" },
    select: {
      id: true,
      status: true,
      ServiceProvider: { select: { user: { select: { id: true } } } },
      job: { select: { title: true } },
    },
  });

  const notificationData: Tnotification = {
    userId: result.ServiceProvider.user.id,
    title: `Job application rejected for ${result.job.title}`,
    body: "",
  };

  sendNotification(notificationData);

  return result;
};

export const JobService = {
  createJob,
  getJobsFromDb,
  getSingleJob,
  getMyJobs,
  confirmApplicant,
  rejectApplicant,
};
