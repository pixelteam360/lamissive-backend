import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { SubscriptionValidation } from "./subscription.validation";
import auth from "../../middlewares/auth";
import { SubscriptionController } from "./subscription.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router
  .route("/")
  .get(auth(UserRole.ADMIN,UserRole.SERVICE_PROVIDER), SubscriptionController.getSubscriptions)
  .post(
    auth(UserRole.ADMIN,UserRole.SERVICE_PROVIDER),
    validateRequest(SubscriptionValidation.CreateSubscriptionValidationSchema),
    SubscriptionController.createSubscription
  );

router
  .route("/:id")
  .get(auth(UserRole.ADMIN,UserRole.SERVICE_PROVIDER), SubscriptionController.getSingleSubscription)
  .put(
    auth(UserRole.ADMIN,UserRole.SERVICE_PROVIDER),
    validateRequest(SubscriptionValidation.SubscriptionUpdateSchema),
    SubscriptionController.updateSubscription
  )
  .delete(auth(UserRole.ADMIN), SubscriptionController.deleteSubscription);

export const SubscriptionRoutes = router;
