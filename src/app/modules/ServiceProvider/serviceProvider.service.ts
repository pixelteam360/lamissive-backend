import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { ServiceProvider } from "@prisma/client";
import httpStatus from "http-status";
import { userController } from "../User/user.controller";

const applyToProject = async (
  payload: { bidPrice: number; clientProjectId: string },
  serviceProviderId: string
) => {
  const project = await prisma.clientProject.findFirst({
    where: { id: payload.clientProjectId },
  });

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
  }

  const isApplyed = await prisma.projectApplicants.findFirst({
    where: { clientProjectId: payload.clientProjectId, serviceProviderId },
  });

  if (isApplyed) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You have already applyed for this project");
  }

  const result = await prisma.projectApplicants.create({
    data: {
      ...payload,
      clientProjectId: payload.clientProjectId,
      serviceProviderId,
    },
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
};
