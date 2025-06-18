"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProviderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const serviceProvider_controller_1 = require("./serviceProvider.controller");
const client_1 = require("@prisma/client");
const serviceProvider_validation_1 = require("./serviceProvider.validation");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, auth_1.default)(), serviceProvider_controller_1.ServiceProviderController.getAllServiceProvider);
router
    .route("/project-apply")
    .post((0, auth_1.default)(client_1.UserRole.SERVICE_PROVIDER), (0, validateRequest_1.default)(serviceProvider_validation_1.ServiceProviderValidation.ApplyToProjectValidation), serviceProvider_controller_1.ServiceProviderController.applyToProject);
router
    .route("/rate-service")
    .post((0, auth_1.default)(client_1.UserRole.CLIENT), (0, validateRequest_1.default)(serviceProvider_validation_1.ServiceProviderValidation.rateServiceSchema), serviceProvider_controller_1.ServiceProviderController.rateServiceProvider);
exports.ServiceProviderRoutes = router;
