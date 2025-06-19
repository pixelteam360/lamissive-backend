"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const job_controller_1 = require("./job.controller");
const client_1 = require("@prisma/client");
const job_validation_1 = require("./job.validation");
const router = express_1.default.Router();
router
    .route("/")
    .get(job_controller_1.JobController.getJobs)
    .post((0, auth_1.default)(client_1.UserRole.EMPLOYER), (0, validateRequest_1.default)(job_validation_1.JobValidation.CreateJobValidationSchema), job_controller_1.JobController.createJob);
router.route("/my").get((0, auth_1.default)(client_1.UserRole.EMPLOYER), job_controller_1.JobController.getMyJobs);
router
    .route("/:id")
    .get((0, auth_1.default)(), job_controller_1.JobController.getSingleJob)
    .patch((0, auth_1.default)(client_1.UserRole.EMPLOYER), (0, validateRequest_1.default)(job_validation_1.JobValidation.confirmApplicantSchema), job_controller_1.JobController.confirmApplicant)
    .delete((0, auth_1.default)(client_1.UserRole.EMPLOYER), job_controller_1.JobController.rejectApplicant);
exports.JobRoutes = router;
