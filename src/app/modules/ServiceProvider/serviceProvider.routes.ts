import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ServiceProviderController } from "./serviceProvider.controller";
import { UserRole } from "@prisma/client";
import { ServiceProviderValidation } from "./serviceProvider.validation";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();

router.route("/").get(auth(), ServiceProviderController.getAllServiceProvider);

router
  .route("/project-apply")
  .post(
    auth(UserRole.SERVICE_PROVIDER),
    validateRequest(ServiceProviderValidation.ApplyToProjectValidation),
    ServiceProviderController.applyToProject
  );

router
  .route("/job-apply")
  .post(
    auth(UserRole.SERVICE_PROVIDER),
    fileUploader.uploadFile,
    ServiceProviderController.applyToJob
  );

router
  .route("/rate-service")
  .post(
    auth(UserRole.CLIENT),
    validateRequest(ServiceProviderValidation.rateServiceSchema),
    ServiceProviderController.rateServiceProvider
  );

router
  .route("/:id")
  .get(auth(), ServiceProviderController.getSingleServiceProvide);

export const ServiceProviderRoutes = router;
