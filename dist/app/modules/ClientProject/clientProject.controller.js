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
exports.ClientProjectController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const clientProject_service_1 = require("./clientProject.service");
const clientProject_costant_1 = require("./clientProject.costant");
const createClientProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield clientProject_service_1.ClientProjectService.createClientProject(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "ClientProject Created successfully!",
        data: result,
    });
}));
const getClientProjects = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, clientProject_costant_1.clientProjectFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield clientProject_service_1.ClientProjectService.getClientProjectsFromDb(filters, options);
    (0, sendResponse_1.default)(res, {
        message: "ClientProjects retrieve successfully!",
        data: result,
    });
}));
const getSingleClientProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield clientProject_service_1.ClientProjectService.getSingleClientProject(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "ClientProject profile retrieved successfully",
        data: result,
    });
}));
const getMyProjects = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, clientProject_costant_1.clientProjectFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield clientProject_service_1.ClientProjectService.getMyProjects(filters, options, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Projects retrieved successfully!",
        data: result,
    });
}));
const confirmApplicant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield clientProject_service_1.ClientProjectService.confirmApplicant(req.body, req.params.id, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Applicant confirm successfully!",
        data: result,
    });
}));
const rejectApplicant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield clientProject_service_1.ClientProjectService.rejectApplicant(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Applicant rejected successfully!",
        data: result,
    });
}));
const cancelProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield clientProject_service_1.ClientProjectService.cancelProject(req.params.id, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Applicant rejected successfully!",
        data: result,
    });
}));
const directHire = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield clientProject_service_1.ClientProjectService.directHire(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Project assigne successfully!",
        data: result,
    });
}));
exports.ClientProjectController = {
    createClientProject,
    getClientProjects,
    getSingleClientProject,
    getMyProjects,
    confirmApplicant,
    rejectApplicant,
    cancelProject,
    directHire
};
