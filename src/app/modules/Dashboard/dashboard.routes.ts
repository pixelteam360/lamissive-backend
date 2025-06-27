import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DashboardController } from "./dashboard.controller";
import { DashboardValidation } from "./dashboard.validation";

const router = express.Router();

router.get("/overview", auth(UserRole.ADMIN), DashboardController.overView);

router
  .route("/fees")
  .post(
    auth(UserRole.ADMIN),
    validateRequest(DashboardValidation.FeesSchema),
    DashboardController.createFees
  )
  .get(auth(UserRole.ADMIN), DashboardController.getFees);

router.put(
  "/fees/:id",
  auth(UserRole.ADMIN),
  validateRequest(DashboardValidation.UpdateFeesSchema),
  DashboardController.updateFees
);

export const DashboardRoutes = router;
