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
exports.ServiceProviderController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const serviceProvider_costant_1 = require("./serviceProvider.costant");
const serviceProvider_service_1 = require("./serviceProvider.service");
const applyToProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield serviceProvider_service_1.ServiceProviderService.applyToProject(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Project applyed successfully!",
        data: result,
    });
}));
const applyToJob = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.parse(req.body.data);
    const result = yield serviceProvider_service_1.ServiceProviderService.applyToJob(data, req.file, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Job applyed successfully!",
        data: result,
    });
}));
const rateServiceProvider = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield serviceProvider_service_1.ServiceProviderService.rateServiceProvider(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Rated Service provider successfully!",
        data: result,
    });
}));
const getAllServiceProvider = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, serviceProvider_costant_1.ServiceProviderFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield serviceProvider_service_1.ServiceProviderService.getAllServiceProvider(filters, options, req.user.id, req.user.role);
    (0, sendResponse_1.default)(res, {
        message: "ServiceProviders retrieved successfully",
        data: result,
    });
}));
const getSingleServiceProvide = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield serviceProvider_service_1.ServiceProviderService.getSingleServiceProvide(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "ServiceProvider retrieved  successfully!",
        data: result,
    });
}));
exports.ServiceProviderController = {
    applyToProject,
    applyToJob,
    getAllServiceProvider,
    getSingleServiceProvide,
    rateServiceProvider,
};
