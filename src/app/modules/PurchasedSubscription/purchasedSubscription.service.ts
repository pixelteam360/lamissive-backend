import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { TPurchasedSubscription } from "./purchasedSubscription.interface";
import httpStatus from "http-status";

const createPurchasedSubscriptionIntoDb = async (
  payload: TPurchasedSubscription,
  userId: string
) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { id: true, ServiceProvider: { select: { id: true } } },
  });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  const subscription = await prisma.subscription.findFirst({
    where: { id: payload.subscriptionId },
  });

  if (!subscription) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Subscription not found");
  }

  const haveSubscription = await prisma.purchasedSubscription.findFirst({
    where: { serviceProviderId: user.ServiceProvider?.id },
  });

  if (haveSubscription?.activeSubscription) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You already have a active subscription"
    );
  }

  const startDate = new Date();

  const endDate = new Date(
    startDate.getTime() + subscription.duration * 24 * 60 * 60 * 1000
  );

  const amount = subscription.price;

  if (haveSubscription) {
    const result = await prisma.$transaction(async (prisma) => {
      const updateSubscription = await prisma.purchasedSubscription.update({
        where: {
          id: haveSubscription.id,
          serviceProviderId: user.ServiceProvider?.id,
        },
        data: {
          activeSubscription: true,
          startDate: startDate,
          amount,
          subscriptionId: payload.subscriptionId,
          endDate,
        },
      });

      await prisma.serviceProvider.update({
        where: { id: user.ServiceProvider?.id },
        data: { activeSubscription: true },
      });

      return updateSubscription;
    });

    return result;
  } else {
    const result = await prisma.$transaction(async (prisma) => {
      const createSubscription = await prisma.purchasedSubscription.create({
        data: {
          ...payload,
          serviceProviderId: user.ServiceProvider?.id!,
          activeSubscription: true,
          endDate,
          amount,
          paymentId: payload.paymentId,
        },
      });

      await prisma.serviceProvider.update({
        where: { id: user.ServiceProvider?.id },
        data: { activeSubscription: true },
      });

      return createSubscription;
    });

    return result;
  }
};

const getPurchasedSubscriptionsFromDb = async () => {
  // const result = await prisma.purchasedSubscription.findMany({
  //   take: 6,
  //   select: {
  //     amount: true,
  //     User: {
  //       select: { fullName: true, email: true, image: true },
  //     },
  //     createdAt: true,
  //   },
  // });
  // return result;
};

const getSinglePurchasedSubscription = async (id: string) => {
  const result = await prisma.purchasedSubscription.findUnique({
    where: { id },
  });
  return result;
};

const getMyPurchasedSubscription = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { id: true, ServiceProvider: { select: { id: true } } },
  });

  const result = await prisma.purchasedSubscription.findFirst({
    where: {
      serviceProviderId: user?.ServiceProvider?.id,
      activeSubscription: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User have no subsceiption");
  }
  return result;
};

export const checkSubscriptions = async () => {
  const today = new Date();
  const expiredSubscriptions = await prisma.purchasedSubscription.findMany({
    where: { endDate: { lt: today }, activeSubscription: true },
    select: { id: true, serviceProviderId: true },
  });

  const expiredUserIds = expiredSubscriptions.map((sub) => sub.serviceProviderId);

  await prisma.$transaction(async (prisma) => {
    const updateSubscription = await prisma.purchasedSubscription.updateMany({
      where: { serviceProviderId: { in: expiredUserIds } },
      data: { activeSubscription: false },
    });

    const updateUser = await prisma.serviceProvider.updateMany({
      where: { id: { in: expiredUserIds }, activeSubscription: true },
      data: { activeSubscription: false },
    });

    return {
      updateSubscription,
      updateUser,
    };
  });
};

export const PurchasedSubscriptionService = {
  createPurchasedSubscriptionIntoDb,
  getPurchasedSubscriptionsFromDb,
  getSinglePurchasedSubscription,
  getMyPurchasedSubscription,
};
