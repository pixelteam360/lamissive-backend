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
exports.PurchasedSubscriptionService = exports.checkSubscriptions = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const createPurchasedSubscriptionIntoDb = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield prisma_1.default.user.findFirst({
        where: { id: userId },
        select: { id: true, ServiceProvider: { select: { id: true } } },
    });
    if (!user) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "User not found");
    }
    const subscription = yield prisma_1.default.subscription.findFirst({
        where: { id: payload.subscriptionId },
    });
    if (!subscription) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Subscription not found");
    }
    const haveSubscription = yield prisma_1.default.purchasedSubscription.findFirst({
        where: { serviceProviderId: (_a = user.ServiceProvider) === null || _a === void 0 ? void 0 : _a.id },
    });
    if (haveSubscription === null || haveSubscription === void 0 ? void 0 : haveSubscription.activeSubscription) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You already have a active subscription");
    }
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + subscription.duration * 24 * 60 * 60 * 1000);
    const amount = subscription.price;
    if (haveSubscription) {
        const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const updateSubscription = yield prisma.purchasedSubscription.update({
                where: {
                    id: haveSubscription.id,
                    serviceProviderId: (_a = user.ServiceProvider) === null || _a === void 0 ? void 0 : _a.id,
                },
                data: {
                    activeSubscription: true,
                    startDate: startDate,
                    amount,
                    subscriptionId: payload.subscriptionId,
                    endDate,
                },
            });
            yield prisma.serviceProvider.update({
                where: { id: (_b = user.ServiceProvider) === null || _b === void 0 ? void 0 : _b.id },
                data: { activeSubscription: true },
            });
            return updateSubscription;
        }));
        return result;
    }
    else {
        const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const createSubscription = yield prisma.purchasedSubscription.create({
                data: Object.assign(Object.assign({}, payload), { serviceProviderId: (_a = user.ServiceProvider) === null || _a === void 0 ? void 0 : _a.id, activeSubscription: true, endDate,
                    amount, paymentId: payload.paymentId }),
            });
            yield prisma.serviceProvider.update({
                where: { id: (_b = user.ServiceProvider) === null || _b === void 0 ? void 0 : _b.id },
                data: { activeSubscription: true },
            });
            return createSubscription;
        }));
        return result;
    }
});
const getPurchasedSubscriptionsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await prisma.purchasedSubscription.findMany({
    //   take: 6,
    //   select: {
    //     amount: true,
    //     User: {
    //       select: { fullName: true, email: true, image: true },
    //     },
    //     createdAt: true,
    //   },
    // });
    // return result;
});
const getSinglePurchasedSubscription = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.purchasedSubscription.findUnique({
        where: { id },
    });
    return result;
});
const getMyPurchasedSubscription = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield prisma_1.default.user.findFirst({
        where: { id: userId },
        select: { id: true, ServiceProvider: { select: { id: true } } },
    });
    const result = yield prisma_1.default.purchasedSubscription.findFirst({
        where: {
            serviceProviderId: (_a = user === null || user === void 0 ? void 0 : user.ServiceProvider) === null || _a === void 0 ? void 0 : _a.id,
            activeSubscription: true,
        },
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User have no subsceiption");
    }
    return result;
});
const checkSubscriptions = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const expiredSubscriptions = yield prisma_1.default.purchasedSubscription.findMany({
        where: { endDate: { lt: today }, activeSubscription: true },
        select: { id: true, serviceProviderId: true },
    });
    const expiredUserIds = expiredSubscriptions.map((sub) => sub.serviceProviderId);
    yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const updateSubscription = yield prisma.purchasedSubscription.updateMany({
            where: { serviceProviderId: { in: expiredUserIds } },
            data: { activeSubscription: false },
        });
        const updateUser = yield prisma.serviceProvider.updateMany({
            where: { id: { in: expiredUserIds }, activeSubscription: true },
            data: { activeSubscription: false },
        });
        return {
            updateSubscription,
            updateUser,
        };
    }));
});
exports.checkSubscriptions = checkSubscriptions;
exports.PurchasedSubscriptionService = {
    createPurchasedSubscriptionIntoDb,
    getPurchasedSubscriptionsFromDb,
    getSinglePurchasedSubscription,
    getMyPurchasedSubscription,
};
