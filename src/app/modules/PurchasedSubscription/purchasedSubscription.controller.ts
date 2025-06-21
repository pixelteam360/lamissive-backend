import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PurchasedSubscriptionService } from "./purchasedSubscription.service";

const createPurchasedSubscription = catchAsync(async (req, res) => {
  const result =
    await PurchasedSubscriptionService.createPurchasedSubscriptionIntoDb(
      req.body,
      req.user.id
    );
  sendResponse(res, {
    message: "Purchased Subscription successfully!",
    data: result,
  });
});

const getPurchasedSubscriptions = catchAsync(async (req, res) => {
  const result =
    await PurchasedSubscriptionService.getPurchasedSubscriptionsFromDb();
  sendResponse(res, {
    message: "Purchased Subscriptions retrieve successfully!",
    data: result,
  });
});

const getSinglePurchasedSubscription = catchAsync(async (req, res) => {
  const result =
    await PurchasedSubscriptionService.getSinglePurchasedSubscription(
      req.params.id
    );
  sendResponse(res, {
    message: "Purchased Subscription retrieved successfully",
    data: result,
  });
});

const getMyPurchasedSubscription = catchAsync(async (req, res) => {
  const { id } = req?.user;
  const result = await PurchasedSubscriptionService.getMyPurchasedSubscription(
    id
  );
  sendResponse(res, {
    message: "Purchased Subscription retrieved successfully!",
    data: result,
  });
});

export const PurchasedSubscriptionController = {
  createPurchasedSubscription,
  getPurchasedSubscriptions,
  getSinglePurchasedSubscription,
  getMyPurchasedSubscription,
};
