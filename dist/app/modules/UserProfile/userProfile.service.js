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
exports.UserProfileService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const fileUploader_1 = require("../../../helpars/fileUploader");
const http_status_1 = __importDefault(require("http-status"));
const createClietnProfile = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield prisma_1.default.client.findFirst({
        where: { userId },
    });
    if (client) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You have already created your profile");
    }
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield prisma.client.create({
            data: Object.assign(Object.assign({}, payload), { userId }),
        });
        yield prisma.user.update({
            where: { id: userId },
            data: { completedProfile: true },
        });
        return client;
    }));
    return result;
});
const updateClietnProfile = (payload, imageFile, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield prisma_1.default.client.findFirst({
        where: { userId },
    });
    if (!client) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User profile not found");
    }
    let image = client.image;
    if (imageFile) {
        image = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(imageFile)).Location;
    }
    const result = yield prisma_1.default.client.update({
        where: { id: client.id },
        data: Object.assign(Object.assign({}, payload), { image, userId }),
    });
    return result;
});
const createEmployerProfile = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const employ = yield prisma_1.default.employ.findFirst({
        where: { userId },
    });
    if (employ) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You have already created your profile");
    }
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const employ = yield prisma.employ.create({
            data: Object.assign(Object.assign({}, payload), { userId }),
        });
        yield prisma.user.update({
            where: { id: userId },
            data: { completedProfile: true },
        });
        return employ;
    }));
    return result;
});
const updateEmployerProfile = (payload, imageFile, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const employ = yield prisma_1.default.employ.findFirst({
        where: { userId },
    });
    if (!employ) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User profile not found");
    }
    let image = employ.image;
    if (imageFile) {
        image = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(imageFile)).Location;
    }
    const result = yield prisma_1.default.employ.update({
        where: { id: employ.id },
        data: Object.assign(Object.assign({}, payload), { image, userId }),
    });
    return result;
});
const createServiceProviderProfile = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceProvider = yield prisma_1.default.serviceProvider.findFirst({
        where: { userId },
    });
    if (serviceProvider) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You have already created your profile");
    }
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const serviceProvider = yield prisma.serviceProvider.create({
            data: Object.assign(Object.assign({}, payload), { userId }),
        });
        yield prisma.user.update({
            where: { id: userId },
            data: { completedProfile: true },
        });
        return serviceProvider;
    }));
    return result;
});
const updateServiceProviderProfile = (payload, imageFile, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceProvider = yield prisma_1.default.serviceProvider.findFirst({
        where: { userId },
    });
    if (!serviceProvider) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User profile not found");
    }
    let image = serviceProvider.image;
    if (imageFile) {
        image = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(imageFile)).Location;
    }
    const result = yield prisma_1.default.serviceProvider.update({
        where: { id: serviceProvider.id },
        data: Object.assign(Object.assign({}, payload), { image, userId }),
    });
    return result;
});
const createConciergeProfile = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const concierge = yield prisma_1.default.concierge.findFirst({
        where: { userId },
    });
    if (concierge) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You have already created your profile");
    }
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const concierge = yield prisma.concierge.create({
            data: Object.assign(Object.assign({}, payload), { userId }),
        });
        yield prisma.user.update({
            where: { id: userId },
            data: { completedProfile: true },
        });
        return concierge;
    }));
    return result;
});
const updateConciergeProfile = (payload, imageFile, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const concierge = yield prisma_1.default.concierge.findFirst({
        where: { userId },
    });
    if (!concierge) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User profile not found");
    }
    let image = concierge.image;
    if (imageFile) {
        image = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(imageFile)).Location;
    }
    const result = yield prisma_1.default.concierge.update({
        where: { id: concierge.id },
        data: Object.assign(Object.assign({}, payload), { image, userId }),
    });
    return result;
});
exports.UserProfileService = {
    createClietnProfile,
    updateClietnProfile,
    createEmployerProfile,
    updateEmployerProfile,
    createServiceProviderProfile,
    updateServiceProviderProfile,
    createConciergeProfile,
    updateConciergeProfile,
};
