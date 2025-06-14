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
exports.UserProfileController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const userProfile_service_1 = require("./userProfile.service");
const createUserProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userProfile_service_1.UserProfileService.createClietnProfile(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Client profile created successfully!",
        data: result,
    });
}));
const updateClietnProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userProfile_service_1.UserProfileService.updateClietnProfile(req.body, req.file, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Client profile updated successfully!",
        data: result,
    });
}));
const createEmployerProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userProfile_service_1.UserProfileService.createEmployerProfile(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Emploer profile created successfully!",
        data: result,
    });
}));
const updateEmployerProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userProfile_service_1.UserProfileService.updateEmployerProfile(req.body, req.file, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Client profile updated successfully!",
        data: result,
    });
}));
const createServiceProviderProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userProfile_service_1.UserProfileService.createServiceProviderProfile(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Service provider profile created successfully!",
        data: result,
    });
}));
const updateServiceProviderProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userProfile_service_1.UserProfileService.updateServiceProviderProfile(req.body, req.file, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Service provider updated successfully!",
        data: result,
    });
}));
exports.UserProfileController = {
    createUserProfile,
    updateClietnProfile,
    createEmployerProfile,
    updateEmployerProfile,
    createServiceProviderProfile,
    updateServiceProviderProfile,
};
