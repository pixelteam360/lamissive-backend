import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";
import { ServiceProviderController } from "./serviceProvider.controller";
import { UserRole } from "@prisma/client";
import { ServiceProviderValidation } from "./serviceProvider.validation";

const router = express.Router();

router
  .route("/project-apply")
  .post(
    auth(UserRole.SERVICE_PROVIDER),
    validateRequest(
      ServiceProviderValidation.ApplyToProjectValidation
    ),
    ServiceProviderController.applyToProject
  );
  
  router
  .route("/rate-service")
  .post(
    auth(UserRole.CLIENT),
    validateRequest(ServiceProviderValidation.rateServiceSchema),
    ServiceProviderController.rateServiceProvider
  );

export const ServiceProviderRoutes = router;
