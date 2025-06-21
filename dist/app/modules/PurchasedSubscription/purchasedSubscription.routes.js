"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasedSubscriptionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const purchasedSubscription_validation_1 = require("./purchasedSubscription.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const purchasedSubscription_controller_1 = require("./purchasedSubscription.controller");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router
    .route("/")
    .get(purchasedSubscription_controller_1.PurchasedSubscriptionController.getPurchasedSubscriptions)
    .post((0, auth_1.default)(client_1.UserRole.SERVICE_PROVIDER, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(purchasedSubscription_validation_1.PurchasedSubscriptionValidation.CreatePurchasedSubscriptionValidationSchema), purchasedSubscription_controller_1.PurchasedSubscriptionController.createPurchasedSubscription);
router.get("/my-purchased", (0, auth_1.default)(client_1.UserRole.SERVICE_PROVIDER), purchasedSubscription_controller_1.PurchasedSubscriptionController.getMyPurchasedSubscription);
router
    .route("/:id")
    .get((0, auth_1.default)(client_1.UserRole.SERVICE_PROVIDER), purchasedSubscription_controller_1.PurchasedSubscriptionController.getSinglePurchasedSubscription);
exports.PurchasedSubscriptionRoutes = router;
