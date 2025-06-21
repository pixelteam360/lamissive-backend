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
exports.SubscriptionController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const subscription_service_1 = require("./subscription.service");
const createSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_service_1.SubscriptionService.createSubscriptionIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        message: "Subscription created successfully!",
        data: result,
    });
}));
const getSubscriptions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_service_1.SubscriptionService.getSubscriptionsFromDb();
    (0, sendResponse_1.default)(res, {
        message: "Subscriptions retrieved successfully!",
        data: result,
    });
}));
const getSingleSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_service_1.SubscriptionService.getSingleSubscription(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Subscription retrieved successfully",
        data: result,
    });
}));
const updateSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_service_1.SubscriptionService.updateSubscription(req.body, req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Subscription updated successfully!",
        data: result,
    });
}));
const deleteSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_service_1.SubscriptionService.deleteSubscription(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Subscription deleted successfully",
        data: result,
    });
}));
exports.SubscriptionController = {
    createSubscription,
    getSubscriptions,
    getSingleSubscription,
    updateSubscription,
    deleteSubscription,
};
