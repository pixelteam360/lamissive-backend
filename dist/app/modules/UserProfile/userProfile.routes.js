"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const userProfile_validation_1 = require("./userProfile.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../../helpars/fileUploader");
const userProfile_controller_1 = require("./userProfile.controller");
const router = express_1.default.Router();
router
    .route("/client")
    .post((0, auth_1.default)(client_1.UserRole.CLIENT), (0, validateRequest_1.default)(userProfile_validation_1.UserProfileValidation.ClientProfileSchema), userProfile_controller_1.UserProfileController.createUserProfile)
    .put((0, auth_1.default)(client_1.UserRole.CLIENT), fileUploader_1.fileUploader.uploadSingle, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(userProfile_validation_1.UserProfileValidation.UpdateClientProfileSchema), userProfile_controller_1.UserProfileController.updateClietnProfile);
router
    .route("/employ")
    .post((0, auth_1.default)(client_1.UserRole.EMPLOYER), (0, validateRequest_1.default)(userProfile_validation_1.UserProfileValidation.EmployerProfileSchema), userProfile_controller_1.UserProfileController.createEmployerProfile)
    .put((0, auth_1.default)(client_1.UserRole.EMPLOYER), fileUploader_1.fileUploader.uploadSingle, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(userProfile_validation_1.UserProfileValidation.UpdateEmployerProfileSchema), userProfile_controller_1.UserProfileController.updateEmployerProfile);
router
    .route("/service-provider")
    .post((0, auth_1.default)(client_1.UserRole.SERVICE_PROVIDER), (0, validateRequest_1.default)(userProfile_validation_1.UserProfileValidation.EmployerProfileSchema), userProfile_controller_1.UserProfileController.createServiceProviderProfile)
    .put((0, auth_1.default)(client_1.UserRole.SERVICE_PROVIDER), fileUploader_1.fileUploader.uploadSingle, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(userProfile_validation_1.UserProfileValidation.UpdateEmployerProfileSchema), userProfile_controller_1.UserProfileController.updateServiceProviderProfile);
exports.UserProfileRoutes = router;
