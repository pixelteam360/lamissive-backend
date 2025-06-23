import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ClientProjectController } from "./clientProject.controller";
import { ClientProjectValidation } from "./clientProject.validation";
import { UserRole } from "@prisma/client";
const router = express.Router();

router
  .route("/")
  .get(ClientProjectController.getClientProjects)
  .post(
    auth(UserRole.CLIENT),
    validateRequest(
      ClientProjectValidation.CreateClientProjectValidationSchema
    ),
    ClientProjectController.createClientProject
  );

router
  .route("/direct-hire")
  .post(
    auth(UserRole.CLIENT),
    validateRequest(
      ClientProjectValidation.CreateClientProjectValidationSchema
    ),
    ClientProjectController.directHire
  );

router
  .route("/my")
  .get(auth(UserRole.CLIENT), ClientProjectController.getMyProjects);

router
  .route("/:id")
  .get(auth(), ClientProjectController.getSingleClientProject)
  .put(
    auth(UserRole.CLIENT),
    validateRequest(ClientProjectValidation.confirmApplicantSchema),
    ClientProjectController.confirmApplicant
  )
  .patch(auth(UserRole.CLIENT), ClientProjectController.rejectApplicant)
  .delete(auth(UserRole.CLIENT), ClientProjectController.cancelProject);

export const ClientProjectRoutes = router;
