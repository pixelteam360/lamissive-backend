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
import { sendNotification } from "../SendNotification/sendNotification";
import { Tnotification } from "../SendNotification/notificationInterface";

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
    select: { id: true, title: true, description: true },
  });

  if (!myProject) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "This is not your project");
  }

  const projectApplicants = await prisma.projectApplicants.findFirst({
    where: {
      clientProjectId: myProject.id,
      serviceProviderId: payload.serviceProviderId,
    },
    select: {
      id: true,
      ServiceProvider: { select: { user: { select: { id: true } } } },
    },
  });

  if (!projectApplicants) {
    throw new ApiError(httpStatus.NOT_FOUND, "Applicant not found");
  }

  const notificationData: Tnotification = {
    userId: projectApplicants.ServiceProvider.user.id,
    title: `Project application accepted for ${myProject.title}`,
    body: myProject.description,
  };

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

    sendNotification(notificationData);

    return updateProject;
  });

  return result;
};

const rejectApplicant = async (id: string) => {
  const result = await prisma.projectApplicants.update({
    where: { id },
    data: { status: "REJECTED" },
    select: {
      id: true,
      status: true,
      ServiceProvider: { select: { user: { select: { id: true } } } },
      clientProject: { select: { title: true } },
    },
  });

  const notificationData: Tnotification = {
    userId: result.ServiceProvider.user.id,
    title: `Project application rejected for ${result.clientProject.title}`,
    body: "",
  };

  sendNotification(notificationData);

  return result;
};

const cancelProject = async (id: string, userId: string) => {
  const clientProject = await prisma.clientProject.findFirst({
    where: { id, userId },
    select: {
      id: true,
      title: true,
      ProjectApplicants: {
        select: {
          ServiceProvider: { select: { user: { select: { id: true } } } },
        },
      },
    },
  });

  if (!clientProject) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unauthorize access");
  }

  const result = await prisma.clientProject.update({
    where: { id, userId },
    data: { status: "CANCELLED" },
  });

  const notificationData: Tnotification = {
    userId: clientProject.ProjectApplicants[0].ServiceProvider.user.id,
    title: `Project cancelled from ${clientProject.title}`,
    body: "",
  };

  sendNotification(notificationData);

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
