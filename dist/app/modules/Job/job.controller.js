"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const job_service_1 = require("./job.service");
const job_costant_1 = require("./job.costant");
const createJob = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_service_1.JobService.createJob(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Job Created successfully!",
        data: result,
    });
}));
const getJobs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, job_costant_1.jobFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield job_service_1.JobService.getJobsFromDb(filters, options);
    (0, sendResponse_1.default)(res, {
        message: "Jobs retrieve successfully!",
        data: result,
    });
}));
const getSingleJob = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_service_1.JobService.getSingleJob(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Job profile retrieved successfully",
        data: result,
    });
}));
const getMyJobs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_service_1.JobService.getMyJobs(req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Projects retrieved successfully!",
        data: result,
    });
}));
const confirmApplicant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_service_1.JobService.confirmApplicant(req.body, req.params.id, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Applicant confirm successfully!",
        data: result,
    });
}));
const rejectApplicant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_service_1.JobService.rejectApplicant(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Applicant rejected successfully!",
        data: result,
    });
}));
exports.JobController = {
    createJob,
    getJobs,
    getSingleJob,
    getMyJobs,
    confirmApplicant,
    rejectApplicant
};
