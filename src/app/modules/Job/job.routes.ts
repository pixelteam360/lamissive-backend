import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";
import { JobController } from "./job.controller";
import { UserRole } from "@prisma/client";
import { JobValidation } from "./job.validation";
const router = express.Router();

router
  .route("/")
  .get(JobController.getJobs)
  .post(
    auth(UserRole.EMPLOYER),
    validateRequest(JobValidation.CreateJobValidationSchema),
    JobController.createJob
  );

router.route("/my").get(auth(UserRole.EMPLOYER), JobController.getMyJobs);

router
  .route("/:id")
  .get(auth(), JobController.getSingleJob)
  .patch(
    auth(UserRole.EMPLOYER),
    validateRequest(JobValidation.confirmApplicantSchema),
    JobController.confirmApplicant
  )
  .delete(auth(UserRole.EMPLOYER), JobController.rejectApplicant);

export const JobRoutes = router;
