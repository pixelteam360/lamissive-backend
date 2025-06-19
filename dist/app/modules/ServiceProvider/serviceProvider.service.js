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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProviderService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const serviceProvider_costant_1 = require("./serviceProvider.costant");
const fileUploader_1 = require("../../../helpars/fileUploader");
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
const applyToJob = (payload, cvFile, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.jobId) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Job id not found");
    }
    if (!cvFile) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "CV not found");
    }
    const project = yield prisma_1.default.job.findFirst({
        where: { id: payload.jobId },
    });
    if (!project) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Job not found");
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
    const isApplyed = yield prisma_1.default.jobApplicants.findFirst({
        where: {
            jobId: payload.jobId,
            serviceProviderId: serviceProvider.id,
        },
    });
    if (isApplyed) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You have already applyed for this project");
    }
    const cv = (yield fileUploader_1.fileUploader.uploadToCloudinary(cvFile)).Location;
    const result = yield prisma_1.default.jobApplicants.create({
        data: {
            cv,
            jobId: payload.jobId,
            serviceProviderId: serviceProvider.id,
        },
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
const getAllServiceProvider = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: serviceProvider_costant_1.ServiceProviderSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditons = { AND: andCondions };
    const result = yield prisma_1.default.serviceProvider.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma_1.default.serviceProvider.count({
        where: whereConditons,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
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
    applyToJob,
    getAllServiceProvider,
    updateProfile,
    rateServiceProvider,
};
