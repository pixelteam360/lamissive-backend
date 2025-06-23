import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { IServiceProviderFilterRequest } from "./serviceProvider.interface";
import { ServiceProviderSearchAbleFields } from "./serviceProvider.costant";
import { fileUploader } from "../../../helpars/fileUploader";
import calculateHaversineDistance from "./serviceProvider.utils";
import { sendNotification } from "../SendNotification/sendNotification";
import { Tnotification } from "../SendNotification/notificationInterface";

const applyToProject = async (
  payload: { bidPrice: number; clientProjectId: string },
  userId: string
) => {
  const project = await prisma.clientProject.findFirst({
    where: { id: payload.clientProjectId },
    select: { status: true, title: true, user: { select: { id: true } } },
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
    select: { id: true, fullName: true },
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
    select: { id: true },
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

  const notificationData: Tnotification = {
    userId: project.user.id,
    title: `Got application from ${serviceProvider.fullName}`,
    body: `${serviceProvider.fullName} just apply for the job ${project.title}`,
  };

  sendNotification(notificationData);

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

  const job = await prisma.job.findFirst({
    where: { id: payload.jobId },
    select: { status: true, title: true, user: { select: { id: true } } },
  });

  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
  }

  if (job.status !== "PENDING") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `This job already ${job.status}`
    );
  }

  const serviceProvider = await prisma.serviceProvider.findFirst({
    where: { userId },
    select: { id: true, fullName: true },
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

  const notificationData: Tnotification = {
    userId: job.user.id,
    title: `Got application from ${serviceProvider.fullName}`,
    body: `${serviceProvider.fullName} just apply for the job ${job.title}`,
  };

  sendNotification(notificationData);

  return result;
};

const rateServiceProvider = async (
  payload: { rating: number; serviceProviderId: string },
  userId: string
) => {
  if (payload.rating > 5) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Rating must be under 5");
  }

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
      where: { serviceProviderId: serviceProvider.id },
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
  options: IPaginationOptions,
  userId: string,
  userRole: string
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
      AND: Object.keys(filterData).map((key) => {
        if (key === "expertise") {
          return {
            [key]: {
              has: (filterData as any)[key],
            },
          };
        }

        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  let currentUser: any;

  if (userRole === "CLIENT") {
    currentUser = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        Client: { select: { let: true, lan: true } },
      },
    });
  } else if (userRole === "EMPLOYER") {
    currentUser = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        Employ: { select: { let: true, lan: true } },
      },
    });
  }

  const currentLet = currentUser?.Client?.let ?? currentUser?.Employ?.let ?? 0;
  const currentLan = currentUser?.Client?.lan ?? currentUser?.Employ?.lan ?? 0;

  const whereConditons: Prisma.ServiceProviderWhereInput = { AND: andCondions };

  const allServiceProvider = await prisma.serviceProvider.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            rating: "asc",
          },

    select: {
      id: true,
      image: true,
      fullName: true,
      location: true,
      expertise: true,
      rating: true,
      hourlyRate: true,
      userId: true,
      let: true,
      lan: true,
    },
  });

  const total = await prisma.serviceProvider.count({
    where: whereConditons,
  });

  if (
    userRole === "ADMIN" ||
    userRole === "CONCIERGE" ||
    userRole === "SERVICE_PROVIDER" ||
    (options && Object.keys(options).length > 0)
  ) {
    const data = allServiceProvider.map((item) => {
      return { ...item, distance: 0 };
    });

    return {
      meta: {
        page,
        limit,
        total,
      },
      data,
    };
  }

  const sortedUsers = allServiceProvider
    .map((user) => {
      const distance = calculateHaversineDistance(
        currentLet,
        currentLan,
        user.let ?? 0,
        user.lan ?? 0
      );
      return { ...user, distance };
    })
    .sort((a, b) => a.distance - b.distance);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: sortedUsers,
  };
};

const getSingleServiceProvide = async (ServiceProviderId: string) => {
  const result = await prisma.serviceProvider.findFirst({
    where: { id: ServiceProviderId },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service provider not found");
  }
  return result;
};

const myWorkschedule = async (userId: string) => {
  const result = await prisma.projectApplicants.findMany({
    where: { serviceProviderId: userId, status: "ACCEPTED" },
    select: { clientProject: { select: { date: true, time: true } } },
    orderBy: { clientProject: { date: "desc" } },
  });

  return result;
};

const myProjects = async (userId: string) => {
  const user = await prisma.serviceProvider.findFirst({
    where: { userId },
  });

  const result = await prisma.projectApplicants.findMany({
    where: { serviceProviderId: user?.id, status: "ACCEPTED" },
    select: {
      clientProject: {
        select: {
          id: true,
          title: true,
          date: true,
          category: true,
          status: true,
          description: true,
        },
      },
    },
    orderBy: { clientProject: { date: "desc" } },
  });

  return result;
};

const myJobs = async (userId: string) => {
  const user = await prisma.serviceProvider.findFirst({
    where: { userId },
  });

  const result = await prisma.jobApplicants.findMany({
    where: { serviceProviderId: user?.id, status: "ACCEPTED" },
    select: {
      job: {
        select: {
          id: true,
          title: true,
          date: true,
          category: true,
          status: true,
          description: true,
        },
      },
    },
    orderBy: { job: { date: "desc" } },
  });

  return result;
};

const getAllConcierge = async () => {
  const resrut = await prisma.concierge.findMany({
    select: { id: true, image: true, fullName: true, location: true },
  });
  return resrut;
};

const getSingleConcierge = async (id: string) => {
  const resrut = await prisma.concierge.findFirst({
    where: { id },
  });
  return resrut;
};

export const ServiceProviderService = {
  applyToProject,
  applyToJob,
  getAllServiceProvider,
  getSingleServiceProvide,
  rateServiceProvider,
  myWorkschedule,
  myProjects,
  myJobs,
  getAllConcierge,
  getSingleConcierge,
};
