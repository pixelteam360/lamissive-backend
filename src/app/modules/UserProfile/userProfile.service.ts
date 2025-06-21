import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import {
  TClientProfile,
  TConcierge,
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

  const result = await prisma.$transaction(async (prisma) => {
    const client = await prisma.client.create({
      data: { ...payload, userId },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { completedProfile: true },
    });

    return client;
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
  const employ = await prisma.employ.findFirst({
    where: { userId },
  });

  if (employ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already created your profile"
    );
  }

  const result = await prisma.$transaction(async (prisma) => {
    const employ = await prisma.employ.create({
      data: { ...payload, userId },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { completedProfile: true },
    });

    return employ;
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
  const serviceProvider = await prisma.serviceProvider.findFirst({
    where: { userId },
  });

  if (serviceProvider) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already created your profile"
    );
  }

  const result = await prisma.$transaction(async (prisma) => {
    const serviceProvider = await prisma.serviceProvider.create({
      data: { ...payload, userId },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { completedProfile: true },
    });

    return serviceProvider;
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

const createConciergeProfile = async (payload: TConcierge, userId: string) => {
  const concierge = await prisma.concierge.findFirst({
    where: { userId },
  });

  if (concierge) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already created your profile"
    );
  }

  const result = await prisma.$transaction(async (prisma) => {
    const concierge = await prisma.concierge.create({
      data: { ...payload, userId },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { completedProfile: true },
    });

    return concierge;
  });

  return result;
};

const updateConciergeProfile = async (
  payload: Partial<TConcierge>,
  imageFile: any,
  userId: string
) => {
  const concierge = await prisma.concierge.findFirst({
    where: { userId },
  });

  if (!concierge) {
    throw new ApiError(httpStatus.NOT_FOUND, "User profile not found");
  }

  let image = concierge.image;
  if (imageFile) {
    image = (await fileUploader.uploadToDigitalOcean(imageFile)).Location;
  }

  const result = await prisma.concierge.update({
    where: { id: concierge.id },
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
  createConciergeProfile,
  updateConciergeProfile,
};
