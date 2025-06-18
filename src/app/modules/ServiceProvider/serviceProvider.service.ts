import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { ServiceProvider } from "@prisma/client";
import httpStatus from "http-status";

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

const getSingleServiceProvider = async (id: string) => {
  //   const ServiceProviderProfile = await prisma.ServiceProvider.findUnique({
  //     where: { id },
  //     select: {
  //       id: true,
  //       fullName: true,
  //       email: true,
  //       createdAt: true,
  //       updatedAt: true,
  //     },
  //   });
  //   return ServiceProviderProfile;
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
  getSingleServiceProvider,
  updateProfile,
  rateServiceProvider,
};
