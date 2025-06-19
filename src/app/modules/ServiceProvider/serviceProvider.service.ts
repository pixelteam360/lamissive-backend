import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { Prisma, ServiceProvider } from "@prisma/client";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { IServiceProviderFilterRequest } from "./serviceProvider.interface";
import { ServiceProviderSearchAbleFields } from "./serviceProvider.costant";
import { fileUploader } from "../../../helpars/fileUploader";

const applyToProject = async (
  payload: { bidPrice: number; clientProjectId: string },
  userId: string
) => {
  const project = await prisma.clientProject.findFirst({
    where: { id: payload.clientProjectId },
  });

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
  }

  if (project.status !== "PENDING") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `This project already ${project.status}`
    );
  }

  const serviceProvider = await prisma.serviceProvider.findFirst({
    where: { userId },
  });

  if (!serviceProvider) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please complete your profile first"
    );
  }

  const isApplyed = await prisma.projectApplicants.findFirst({
    where: {
      clientProjectId: payload.clientProjectId,
      serviceProviderId: serviceProvider.id,
    },
  });

  if (isApplyed) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already applyed for this project"
    );
  }

  const result = await prisma.projectApplicants.create({
    data: {
      ...payload,
      clientProjectId: payload.clientProjectId,
      serviceProviderId: serviceProvider.id,
    },
  });

  return result;
};

const applyToJob = async (
  payload: { jobId: string },
  cvFile: any,
  userId: string
) => {
  if (!payload.jobId) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job id not found");
  }

  if (!cvFile) {
    throw new ApiError(httpStatus.NOT_FOUND, "CV not found");
  }

  const project = await prisma.job.findFirst({
    where: { id: payload.jobId },
  });

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
  }

  if (project.status !== "PENDING") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `This project already ${project.status}`
    );
  }

  const serviceProvider = await prisma.serviceProvider.findFirst({
    where: { userId },
  });

  if (!serviceProvider) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please complete your profile first"
    );
  }

  const isApplyed = await prisma.jobApplicants.findFirst({
    where: {
      jobId: payload.jobId,
      serviceProviderId: serviceProvider.id,
    },
  });

  if (isApplyed) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already applyed for this project"
    );
  }

  const cv = (await fileUploader.uploadToCloudinary(cvFile)).Location;

  const result = await prisma.jobApplicants.create({
    data: {
      cv,
      jobId: payload.jobId,
      serviceProviderId: serviceProvider.id,
    },
  });

  return result;
};

const rateServiceProvider = async (
  payload: { rating: number; serviceProviderId: string },
  userId: string
) => {
  const serviceProvider = await prisma.serviceProvider.findFirst({
    where: { id: payload.serviceProviderId },
  });

  if (!serviceProvider) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service Provider not found");
  }

  const result = await prisma.$transaction(async (prisma) => {
    const serviceRating = await prisma.serviceRating.create({
      data: { ...payload, userId },
    });

    const totalRating = await prisma.serviceRating.count({
      where: { serviceProviderId: serviceProvider.id },
    });

    const sumOfRating = await prisma.serviceRating.aggregate({
      _sum: { rating: true },
    });

    const averageRating = (sumOfRating._sum.rating ?? 0) / (totalRating || 1);

    await prisma.serviceProvider.update({
      where: { id: payload.serviceProviderId },
      data: { rating: averageRating },
    });

    return serviceRating;
  });
  return result;
};

const getAllServiceProvider = async (
  params: IServiceProviderFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.ServiceProviderWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: ServiceProviderSearchAbleFields.map((field) => ({
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
  const whereConditons: Prisma.ServiceProviderWhereInput = { AND: andCondions };

  const result = await prisma.serviceProvider.findMany({
    where: whereConditons,
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

  const total = await prisma.serviceProvider.count({
    where: whereConditons,
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

const updateProfile = async (
  payload: ServiceProvider,
  imageFile: any,
  ServiceProviderId: string
) => {
  //   const result = await prisma.$transaction(async (prisma) => {
  //     let image = "";
  //     if (imageFile) {
  //       image = (await fileUploader.uploadToCloudinary(imageFile)).Location;
  //     }
  //     const createServiceProviderProfile = await prisma.ServiceProvider.update({
  //       where: { id: ServiceProviderId },
  //       data: { ...payload, image },
  //     });
  //     return createServiceProviderProfile;
  //   });
  //   return result;
};

export const ServiceProviderService = {
  applyToProject,
  applyToJob,
  getAllServiceProvider,
  updateProfile,
  rateServiceProvider,
};
