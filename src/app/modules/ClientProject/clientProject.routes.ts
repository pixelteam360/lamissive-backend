import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";
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
  .route("/my")
  .get(auth(UserRole.CLIENT), ClientProjectController.getMyProjects);

router
  .route("/:id")
  .get(auth(UserRole.CLIENT), ClientProjectController.getSingleClientProject)
  .put(
    auth(UserRole.CLIENT),
    validateRequest(ClientProjectValidation.ClientProjectUpdateSchema),
    ClientProjectController.getMyProjects
  );

export const ClientProjectRoutes = router;
