import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const overView = async () => {
  const totalUsers = await prisma.user.count();
  const totalProjects = await prisma.clientProject.count();
  const totalJobs = await prisma.job.count();
  const totalServiceProviders = await prisma.serviceProvider.count();

  return {
    totalUsers,
    totalProjects,
    totalJobs,
    totalServiceProviders,
  };
};

const createFees = async (payload: { jobFee: number; projectFee: number }) => {
  const existingFees = await prisma.fees.findMany();

  if (existingFees.length > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Fees already exist. You can only update them."
    );
  }

  const fees = await prisma.fees.create({
    data: {
      jobFee: payload.jobFee,
      projectFee: payload.projectFee,
    },
  });
  return fees;
};

const getFees = async () => {
  const fees = await prisma.fees.findMany();
  return fees;
};

const updateFees = async (
  id: string,
  payload: { jobFee: number; projectFee: number }
) => {
  const existingFees = await prisma.fees.findUnique({
    where: { id },
  });

  if (!existingFees) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fees not found");
  }

  const updatedFees = await prisma.fees.update({
    where: { id },
    data: {
      jobFee: payload.jobFee,
      projectFee: payload.projectFee,
    },
  });
  return updatedFees;
};

export const dashboardService = {
  overView,
  createFees,
  updateFees,
  getFees,
};
