import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SubscriptionService } from "./subscription.service";
import pick from "../../../shared/pick";

const createSubscription = catchAsync(async (req, res) => {
  const result = await SubscriptionService.createSubscriptionIntoDb(req.body);
  sendResponse(res, {
    message: "Subscription created successfully!",
    data: result,
  });
});

const getSubscriptions = catchAsync(async (req, res) => {
  const result = await SubscriptionService.getSubscriptionsFromDb();
  sendResponse(res, {
    message: "Subscriptions retrieved successfully!",
    data: result,
  });
});

const getSingleSubscription = catchAsync(async (req, res) => {
  const result = await SubscriptionService.getSingleSubscription(req.params.id);
  sendResponse(res, {
    message: "Subscription retrieved successfully",
    data: result,
  });
});

const updateSubscription = catchAsync(async (req, res) => {
  const result = await SubscriptionService.updateSubscription(
    req.body,
    req.params.id
  );
  sendResponse(res, {
    message: "Subscription updated successfully!",
    data: result,
  });
});

const deleteSubscription = catchAsync(async (req, res) => {
  const result = await SubscriptionService.deleteSubscription(req.params.id);
  sendResponse(res, {
    message: "Subscription deleted successfully",
    data: result,
  });
});

export const SubscriptionController = {
  createSubscription,
  getSubscriptions,
  getSingleSubscription,
  updateSubscription,
  deleteSubscription,
};
