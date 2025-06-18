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
exports.ServiceProviderService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const applyToProject = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield prisma_1.default.clientProject.findFirst({
        where: { id: payload.clientProjectId },
    });
    if (!project) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    if (project.status !== "PENDING") {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, `This project already ${project.status}`);
    }
    const serviceProvider = yield prisma_1.default.serviceProvider.findFirst({
        where: { userId },
    });
    if (!serviceProvider) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Please complete your profile first");
    }
    const isApplyed = yield prisma_1.default.projectApplicants.findFirst({
        where: {
            clientProjectId: payload.clientProjectId,
            serviceProviderId: serviceProvider.id,
        },
    });
    if (isApplyed) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You have already applyed for this project");
    }
    const result = yield prisma_1.default.projectApplicants.create({
        data: Object.assign(Object.assign({}, payload), { clientProjectId: payload.clientProjectId, serviceProviderId: serviceProvider.id }),
    });
    return result;
});
const rateServiceProvider = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceProvider = yield prisma_1.default.serviceProvider.findFirst({
        where: { id: payload.serviceProviderId },
    });
    if (!serviceProvider) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Service Provider not found");
    }
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const serviceRating = yield prisma.serviceRating.create({
            data: Object.assign(Object.assign({}, payload), { userId }),
        });
        const totalRating = yield prisma.serviceRating.count({
            where: { serviceProviderId: serviceProvider.id },
        });
        const sumOfRating = yield prisma.serviceRating.aggregate({
            _sum: { rating: true },
        });
        const averageRating = ((_a = sumOfRating._sum.rating) !== null && _a !== void 0 ? _a : 0) / (totalRating || 1);
        yield prisma.serviceProvider.update({
            where: { id: payload.serviceProviderId },
            data: { rating: averageRating },
        });
        return serviceRating;
    }));
    return result;
});
const getSingleServiceProvider = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //   const ServiceProviderProfile = await prisma.ServiceProvider.findUnique({
    //     where: { id },
    //     select: {
    //       id: true,
    //       fullName: true,
    //       email: true,
    //       createdAt: true,
    //       updatedAt: true,
    //     },
    //   });
    //   return ServiceProviderProfile;
});
const updateProfile = (payload, imageFile, ServiceProviderId) => __awaiter(void 0, void 0, void 0, function* () {
    //   const result = await prisma.$transaction(async (prisma) => {
    //     let image = "";
    //     if (imageFile) {
    //       image = (await fileUploader.uploadToCloudinary(imageFile)).Location;
    //     }
    //     const createServiceProviderProfile = await prisma.ServiceProvider.update({
    //       where: { id: ServiceProviderId },
    //       data: { ...payload, image },
    //     });
    //     return createServiceProviderProfile;
    //   });
    //   return result;
});
exports.ServiceProviderService = {
    applyToProject,
    getSingleServiceProvider,
    updateProfile,
    rateServiceProvider,
};
