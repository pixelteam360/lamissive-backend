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
exports.PurchasedSubscriptionController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const purchasedSubscription_service_1 = require("./purchasedSubscription.service");
const createPurchasedSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield purchasedSubscription_service_1.PurchasedSubscriptionService.createPurchasedSubscriptionIntoDb(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Purchased Subscription successfully!",
        data: result,
    });
}));
const getPurchasedSubscriptions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield purchasedSubscription_service_1.PurchasedSubscriptionService.getPurchasedSubscriptionsFromDb();
    (0, sendResponse_1.default)(res, {
        message: "Purchased Subscriptions retrieve successfully!",
        data: result,
    });
}));
const getSinglePurchasedSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield purchasedSubscription_service_1.PurchasedSubscriptionService.getSinglePurchasedSubscription(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Purchased Subscription retrieved successfully",
        data: result,
    });
}));
const getMyPurchasedSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.user;
    const result = yield purchasedSubscription_service_1.PurchasedSubscriptionService.getMyPurchasedSubscription(id);
    (0, sendResponse_1.default)(res, {
        message: "Purchased Subscription retrieved successfully!",
        data: result,
    });
}));
exports.PurchasedSubscriptionController = {
    createPurchasedSubscription,
    getPurchasedSubscriptions,
    getSinglePurchasedSubscription,
    getMyPurchasedSubscription,
};
