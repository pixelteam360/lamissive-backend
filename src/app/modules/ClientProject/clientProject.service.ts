import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma } from "@prisma/client";
import {
  IClientProjectFilterRequest,
  TClientProject,
} from "./clientProject.interface";
import { clientProjectSearchAbleFields } from "./clientProject.costant";
import httpStatus from "http-status";

const createClientProject = async (payload: TClientProject, userId: string) => {
  const result = await prisma.clientProject.create({
    data: { ...payload, userId },
  });

  return result;
};

const getClientProjectsFromDb = async (
  params: IClientProjectFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.ClientProjectWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: clientProjectSearchAbleFields.map((field) => ({
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
  const whereConditons: Prisma.ClientProjectWhereInput = { AND: andCondions };

  const result = await prisma.clientProject.findMany({
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
  const total = await prisma.clientProject.count({
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

const getSingleClientProject = async (id: string) => {
  const ClientProjectProfile = await prisma.clientProject.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          Client: { select: { fullName: true, location: true, image: true } },
        },
      },
      ProjectApplicants: {
        where: { status: { not: "REJECTED" } },
        select: {
          id: true,
          bidPrice: true,
          status: true,
          ServiceProvider: {
            select: { id: true, image: true, fullName: true },
          },
        },
      },
    },
  });

  return ClientProjectProfile;
};

const getMyProjects = async (
  params: IClientProjectFilterRequest,
  options: IPaginationOptions,
  userId: string
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.ClientProjectWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: clientProjectSearchAbleFields.map((field) => ({
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
  const whereConditons: Prisma.ClientProjectWhereInput = { AND: andCondions };

  const result = await prisma.clientProject.findMany({
    where: { ...whereConditons, userId },
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
  const total = await prisma.clientProject.count({
    where: { ...whereConditons, userId },
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

const confirmApplicant = async (
  payload: { serviceProviderId: string },
  projectId: string,
  userId: string
) => {
  const myProject = await prisma.clientProject.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  });

  if (!myProject) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "This is not your project");
  }

  const projectApplicants = await prisma.projectApplicants.findFirst({
    where: {
      clientProjectId: myProject.id,
      serviceProviderId: payload.serviceProviderId,
    },
    select: { id: true },
  });

  if (!projectApplicants) {
    throw new ApiError(httpStatus.NOT_FOUND, "Applicant not found");
  }

  const result = await prisma.$transaction(async (prisma) => {
    const updateProject = await prisma.clientProject.update({
      where: { id: myProject.id },
      data: { status: "ONGOING" },
    });

    await prisma.projectApplicants.update({
      where: { id: projectApplicants.id },
      data: { status: "ACCEPTED" },
    });

    await prisma.projectApplicants.deleteMany({
      where: { clientProjectId: myProject.id, status: { not: "ACCEPTED" } },
    });

    return updateProject;
  });

  return result;
};

const rejectApplicant = async (id: string) => {
  const result = await prisma.projectApplicants.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  return result;
};

const cancelProject = async (id: string, userId: string) => {
  const clientProject = await prisma.clientProject.findFirst({
    where: { id, userId },
  });

  if (!clientProject) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unauthorize access");
  }

  const result = await prisma.clientProject.update({
    where: { id, userId },
    data: { status: "CANCELLED" },
  });

  return result;
};

export const ClientProjectService = {
  createClientProject,
  getClientProjectsFromDb,
  getSingleClientProject,
  getMyProjects,
  confirmApplicant,
  rejectApplicant,
  cancelProject,
};
