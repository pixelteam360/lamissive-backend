import prisma from "../../../shared/prisma";
import { Subscription } from "@prisma/client";
import { TSubscription } from "./subscription.interface";

const createSubscriptionIntoDb = async (payload: TSubscription) => {
  const result = await prisma.subscription.create({
    data: payload,
  });
  return result;
};

const getSubscriptionsFromDb = async () => {
  const subscription = await prisma.subscription.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
  });
  return subscription;
};

const getSingleSubscription = async (id: string) => {
  const SubscriptionProfile = await prisma.subscription.findUnique({
    where: { id, isDeleted: false },
  });
  return SubscriptionProfile;
};

const updateSubscription = async (
  payload: Partial<Subscription>,
  subscriptionId: string
) => {
  const result = await prisma.subscription.update({
    where: { id: subscriptionId, isDeleted: false },
    data: payload,
  });
  return result;
};

const deleteSubscription = async (id: string) => {
  await prisma.subscription.update({
    where: { id },
    data: { isDeleted: true },
  });
  return { message: "Subscription deleted successfully" };
};

export const SubscriptionService = {
  createSubscriptionIntoDb,
  getSubscriptionsFromDb,
  getSingleSubscription,
  updateSubscription,
  deleteSubscription,
};
