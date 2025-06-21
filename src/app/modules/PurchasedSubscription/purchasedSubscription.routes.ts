import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PurchasedSubscriptionValidation } from "./purchasedSubscription.validation";
import auth from "../../middlewares/auth";
import { PurchasedSubscriptionController } from "./purchasedSubscription.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router
  .route("/")
  .get(PurchasedSubscriptionController.getPurchasedSubscriptions)
  .post(
    auth(UserRole.SERVICE_PROVIDER, UserRole.ADMIN),
    validateRequest(
      PurchasedSubscriptionValidation.CreatePurchasedSubscriptionValidationSchema
    ),
    PurchasedSubscriptionController.createPurchasedSubscription
  );

router.get(
  "/my-purchased",
  auth(UserRole.SERVICE_PROVIDER),
  PurchasedSubscriptionController.getMyPurchasedSubscription
);

router
  .route("/:id")
  .get(
    auth(UserRole.SERVICE_PROVIDER),
    PurchasedSubscriptionController.getSinglePurchasedSubscription
  );

export const PurchasedSubscriptionRoutes = router;
