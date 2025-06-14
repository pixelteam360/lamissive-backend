import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserProfileValidation } from "./userProfile.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";
import { UserProfileController } from "./userProfile.controller";

const router = express.Router();

router
  .route("/client")
  .post(
    auth(UserRole.CLIENT),
    validateRequest(UserProfileValidation.ClientProfileSchema),
    UserProfileController.createUserProfile
  )
  .put(
    auth(UserRole.CLIENT),
    fileUploader.uploadSingle,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(UserProfileValidation.UpdateClientProfileSchema),
    UserProfileController.updateClietnProfile
  );

router
  .route("/employ")
  .post(
    auth(UserRole.EMPLOYER),
    validateRequest(UserProfileValidation.EmployerProfileSchema),
    UserProfileController.createEmployerProfile
  )
  .put(
    auth(UserRole.EMPLOYER),
    fileUploader.uploadSingle,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(UserProfileValidation.UpdateEmployerProfileSchema),
    UserProfileController.updateEmployerProfile
  );

router
  .route("/service-provider")
  .post(
    auth(UserRole.SERVICE_PROVIDER),
    validateRequest(UserProfileValidation.EmployerProfileSchema),
    UserProfileController.createServiceProviderProfile
  )
  .put(
    auth(UserRole.SERVICE_PROVIDER),
    fileUploader.uploadSingle,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(UserProfileValidation.UpdateEmployerProfileSchema),
    UserProfileController.updateServiceProviderProfile
  );

export const UserProfileRoutes = router;
