import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import * as bcrypt from "bcrypt";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma, User, UserRole } from "@prisma/client";
import { userSearchAbleFields } from "./user.costant";
import config from "../../../config";
import { fileUploader } from "../../../helpars/fileUploader";
import { IUserFilterRequest, TUser } from "./user.interface";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import { Secret } from "jsonwebtoken";

const createUserIntoDb = async (payload: TUser) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    if (existingUser.email === payload.email) {
      throw new ApiError(
        400,
        `User with this email ${payload.email} already exists`
      );
    }
  }
  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const userData = await prisma.user.create({
    data: { ...payload, password: hashedPassword },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    role: userData.role,
    completedProfile: userData.completedProfile,
    token: accessToken,
  };
};

const getUsersFromDb = async (
  params: IUserFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchAbleFields.map((field) => ({
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
  const whereConditons: Prisma.UserWhereInput = { AND: andCondions };

  const result = await prisma.user.findMany({
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
    select: {
      id: true,
      email: true,
      role: true,
    },
  });
  const total = await prisma.user.count({
    where: whereConditons,
  });

  if (!result || result.length === 0) {
    throw new ApiError(404, "No active users found");
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

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: { id: true, role: true, ServiceProvider: { select: { id: true } } },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const roleFieldMap: Record<UserRole, string> = {
    CLIENT: "Client",
    SERVICE_PROVIDER: "ServiceProvider",
    EMPLOYER: "Employ",
    CONCIERGE: "Concierge",
    ADMIN: "Admin",
  };

  const relatedField = roleFieldMap[user.role];

  const selectFields: any = {
    id: true,
    email: true,
    role: true,
    completedProfile: true,
    [relatedField]: true,
  };

  const result = await prisma.user.findFirst({
    where: {
      id: user.id,
    },
    select: selectFields,
  });

  if (user.role === "SERVICE_PROVIDER") {
    const completedProject = await prisma.projectApplicants.count({
      where: {
        serviceProviderId: user.ServiceProvider?.id,
        clientProject: { is: { status: "COMPLETED" } },
      },
    });
    return { ...result, completedProject };
  }
  return result;
};

const updateProfile = async (payload: User, imageFile: any, userId: string) => {
  const result = await prisma.$transaction(async (prisma) => {
    let image = "";
    if (imageFile) {
      image = (await fileUploader.uploadToCloudinary(imageFile)).Location;
    }

    const createUserProfile = await prisma.user.update({
      where: { id: userId },
      data: { ...payload },
    });

    return createUserProfile;
  });

  return result;
};

export const userService = {
  createUserIntoDb,
  getUsersFromDb,
  getMyProfile,
  updateProfile,
};
