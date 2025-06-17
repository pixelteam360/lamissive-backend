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
    where: { ...whereConditons, status: "ONGOING" },
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
    where: { ...whereConditons, status: "ONGOING" },
  });

  if (!result || result.length === 0) {
    throw new ApiError(404, "No active ClientProjects found");
  }
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
      ProjectApplicants: {
        select: {
          id: true,
          bidPrice: true,
          status: true,
        //   ServiceProvider: {
        //     select: { image: true, fullName: true },
        //   },
        },
      },
    },
  });

  return ClientProjectProfile;
};

const getMyProjects = async (userId: string) => {
  const result = await prisma.clientProject.findMany({
    where: { userId },
  });

  return result;
};

const confirmApplicant = async (projectId: string, applicantId: string) => {};

export const ClientProjectService = {
  createClientProject,
  getClientProjectsFromDb,
  getSingleClientProject,
  getMyProjects,
};
