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
exports.SubscriptionService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createSubscriptionIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.subscription.create({
        data: payload,
    });
    return result;
});
const getSubscriptionsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield prisma_1.default.subscription.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
    });
    return subscription;
});
const getSingleSubscription = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const SubscriptionProfile = yield prisma_1.default.subscription.findUnique({
        where: { id, isDeleted: false },
    });
    return SubscriptionProfile;
});
const updateSubscription = (payload, subscriptionId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.subscription.update({
        where: { id: subscriptionId, isDeleted: false },
        data: payload,
    });
    return result;
});
const deleteSubscription = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.subscription.update({
        where: { id },
        data: { isDeleted: true },
    });
    return { message: "Subscription deleted successfully" };
});
exports.SubscriptionService = {
    createSubscriptionIntoDb,
    getSubscriptionsFromDb,
    getSingleSubscription,
    updateSubscription,
    deleteSubscription,
};
