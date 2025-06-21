import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ServiceProviderController } from "./serviceProvider.controller";
import { UserRole } from "@prisma/client";
import { ServiceProviderValidation } from "./serviceProvider.validation";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();

router.route("/").get(auth(), ServiceProviderController.getAllServiceProvider);

router.route("/concierges").get(auth(), ServiceProviderController.getAllConcierge);

router
  .route("/project-apply")
  .get(auth(UserRole.SERVICE_PROVIDER), ServiceProviderController.myProjects)
  .post(
    auth(UserRole.SERVICE_PROVIDER),
    validateRequest(ServiceProviderValidation.ApplyToProjectValidation),
    ServiceProviderController.applyToProject
  );

router
  .route("/job-apply")
  .get(auth(UserRole.SERVICE_PROVIDER), ServiceProviderController.myJobs)
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

router
  .route("/schedule/:id")
  .get(auth(), ServiceProviderController.myWorkschedule);

  router.route("/concierges/:id").get(auth(), ServiceProviderController.getSingleConcierge);

export const ServiceProviderRoutes = router;
