"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const subscription_validation_1 = require("./subscription.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const subscription_controller_1 = require("./subscription.controller");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SERVICE_PROVIDER), subscription_controller_1.SubscriptionController.getSubscriptions)
    .post((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SERVICE_PROVIDER), (0, validateRequest_1.default)(subscription_validation_1.SubscriptionValidation.CreateSubscriptionValidationSchema), subscription_controller_1.SubscriptionController.createSubscription);
router
    .route("/:id")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SERVICE_PROVIDER), subscription_controller_1.SubscriptionController.getSingleSubscription)
    .put((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SERVICE_PROVIDER), (0, validateRequest_1.default)(subscription_validation_1.SubscriptionValidation.SubscriptionUpdateSchema), subscription_controller_1.SubscriptionController.updateSubscription)
    .delete((0, auth_1.default)(client_1.UserRole.ADMIN), subscription_controller_1.SubscriptionController.deleteSubscription);
exports.SubscriptionRoutes = router;
