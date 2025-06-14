import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import {
  TClientProfile,
  TEmployProfile,
  TServiceProviderProfile,
} from "./userProfile.interface";
import { fileUploader } from "../../../helpars/fileUploader";
import httpStatus from "http-status";

const createClietnProfile = async (payload: TClientProfile, userId: string) => {
  const client = await prisma.client.findFirst({
    where: { userId },
  });

  if (client) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already created your profile"
    );
  }

  const result = await prisma.client.create({
    data: { ...payload, userId },
  });

  return result;
};

const updateClietnProfile = async (
  payload: TClientProfile,
  imageFile: any,
  userId: string
) => {
  const client = await prisma.client.findFirst({
    where: { userId },
  });

  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, "User profile not found");
  }

  let image = client.image;
  if (imageFile) {
    image = (await fileUploader.uploadToDigitalOcean(imageFile)).Location;
  }

  const result = await prisma.client.update({
    where: { id: client.id },
    data: { ...payload, image, userId },
  });

  return result;
};

const createEmployerProfile = async (
  payload: TEmployProfile,
  userId: string
) => {
  console.log(userId);
  const client = await prisma.employ.findFirst({
    where: { userId },
  });

  if (client) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already created your profile"
    );
  }

  const result = await prisma.employ.create({
    data: { ...payload, userId },
  });

  return result;
};

const updateEmployerProfile = async (
  payload: TEmployProfile,
  imageFile: any,
  userId: string
) => {
  const employ = await prisma.employ.findFirst({
    where: { userId },
  });

  if (!employ) {
    throw new ApiError(httpStatus.NOT_FOUND, "User profile not found");
  }

  let image = employ.image;
  if (imageFile) {
    image = (await fileUploader.uploadToDigitalOcean(imageFile)).Location;
  }

  const result = await prisma.employ.update({
    where: { id: employ.id },
    data: { ...payload, image, userId },
  });

  return result;
};

const createServiceProviderProfile = async (
  payload: TServiceProviderProfile,
  userId: string
) => {
  console.log(userId);
  const client = await prisma.serviceProvider.findFirst({
    where: { userId },
  });

  if (client) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already created your profile"
    );
  }

  const result = await prisma.serviceProvider.create({
    data: { ...payload, userId },
  });

  return result;
};

const updateServiceProviderProfile = async (
  payload: TServiceProviderProfile,
  imageFile: any,
  userId: string
) => {
  const serviceProvider = await prisma.serviceProvider.findFirst({
    where: { userId },
  });

  if (!serviceProvider) {
    throw new ApiError(httpStatus.NOT_FOUND, "User profile not found");
  }

  let image = serviceProvider.image;
  if (imageFile) {
    image = (await fileUploader.uploadToDigitalOcean(imageFile)).Location;
  }

  const result = await prisma.serviceProvider.update({
    where: { id: serviceProvider.id },
    data: { ...payload, image, userId },
  });

  return result;
};

export const UserProfileService = {
  createClietnProfile,
  updateClietnProfile,
  createEmployerProfile,
  updateEmployerProfile,
  createServiceProviderProfile,
  updateServiceProviderProfile,
};
