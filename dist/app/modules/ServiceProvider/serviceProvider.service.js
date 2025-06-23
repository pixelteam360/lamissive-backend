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
const serviceProvider_utils_1 = __importDefault(require("./serviceProvider.utils"));
const sendNotification_1 = require("../SendNotification/sendNotification");
const applyToProject = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield prisma_1.default.clientProject.findFirst({
        where: { id: payload.clientProjectId },
        select: { status: true, title: true, user: { select: { id: true } } },
    });
    if (!project) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    if (project.status !== "PENDING") {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, `This project already ${project.status}`);
    }
    const serviceProvider = yield prisma_1.default.serviceProvider.findFirst({
        where: { userId },
        select: { id: true, fullName: true },
    });
    if (!serviceProvider) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Please complete your profile first");
    }
    const isApplyed = yield prisma_1.default.projectApplicants.findFirst({
        where: {
            clientProjectId: payload.clientProjectId,
            serviceProviderId: serviceProvider.id,
        },
        select: { id: true },
    });
    if (isApplyed) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You have already applyed for this project");
    }
    const result = yield prisma_1.default.projectApplicants.create({
        data: Object.assign(Object.assign({}, payload), { clientProjectId: payload.clientProjectId, serviceProviderId: serviceProvider.id }),
    });
    const notificationData = {
        userId: project.user.id,
        title: `Got application from ${serviceProvider.fullName}`,
        body: `${serviceProvider.fullName} just apply for the job ${project.title}`,
    };
    (0, sendNotification_1.sendNotification)(notificationData);
    return result;
});
const applyToJob = (payload, cvFile, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.jobId) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Job id not found");
    }
    if (!cvFile) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "CV not found");
    }
    const job = yield prisma_1.default.job.findFirst({
        where: { id: payload.jobId },
        select: { status: true, title: true, user: { select: { id: true } } },
    });
    if (!job) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Job not found");
    }
    if (job.status !== "PENDING") {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, `This job already ${job.status}`);
    }
    const serviceProvider = yield prisma_1.default.serviceProvider.findFirst({
        where: { userId },
        select: { id: true, fullName: true },
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
    const cv = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(cvFile)).Location;
    const result = yield prisma_1.default.jobApplicants.create({
        data: {
            cv,
            jobId: payload.jobId,
            serviceProviderId: serviceProvider.id,
        },
    });
    const notificationData = {
        userId: job.user.id,
        title: `Got application from ${serviceProvider.fullName}`,
        body: `${serviceProvider.fullName} just apply for the job ${job.title}`,
    };
    (0, sendNotification_1.sendNotification)(notificationData);
    return result;
});
const rateServiceProvider = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.rating > 5) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Rating must be under 5");
    }
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
            where: { serviceProviderId: serviceProvider.id },
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
const getAllServiceProvider = (params, options, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
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
            AND: Object.keys(filterData).map((key) => {
                if (key === "expertise") {
                    return {
                        [key]: {
                            has: filterData[key],
                        },
                    };
                }
                return {
                    [key]: {
                        equals: filterData[key],
                    },
                };
            }),
        });
    }
    let currentUser;
    if (userRole === "CLIENT") {
        currentUser = yield prisma_1.default.user.findFirst({
            where: { id: userId },
            include: {
                Client: { select: { let: true, lan: true } },
            },
        });
    }
    else if (userRole === "EMPLOYER") {
        currentUser = yield prisma_1.default.user.findFirst({
            where: { id: userId },
            include: {
                Employ: { select: { let: true, lan: true } },
            },
        });
    }
    const currentLet = (_d = (_b = (_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.Client) === null || _a === void 0 ? void 0 : _a.let) !== null && _b !== void 0 ? _b : (_c = currentUser === null || currentUser === void 0 ? void 0 : currentUser.Employ) === null || _c === void 0 ? void 0 : _c.let) !== null && _d !== void 0 ? _d : 0;
    const currentLan = (_h = (_f = (_e = currentUser === null || currentUser === void 0 ? void 0 : currentUser.Client) === null || _e === void 0 ? void 0 : _e.lan) !== null && _f !== void 0 ? _f : (_g = currentUser === null || currentUser === void 0 ? void 0 : currentUser.Employ) === null || _g === void 0 ? void 0 : _g.lan) !== null && _h !== void 0 ? _h : 0;
    const whereConditons = { AND: andCondions };
    const allServiceProvider = yield prisma_1.default.serviceProvider.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                rating: "asc",
            },
        select: {
            id: true,
            image: true,
            fullName: true,
            location: true,
            expertise: true,
            rating: true,
            hourlyRate: true,
            userId: true,
            let: true,
            lan: true,
        },
    });
    const total = yield prisma_1.default.serviceProvider.count({
        where: whereConditons,
    });
    if (userRole === "ADMIN" ||
        userRole === "CONCIERGE" ||
        userRole === "SERVICE_PROVIDER" ||
        (options && Object.keys(options).length > 0)) {
        const data = allServiceProvider.map((item) => {
            return Object.assign(Object.assign({}, item), { distance: 0 });
        });
        return {
            meta: {
                page,
                limit,
                total,
            },
            data,
        };
    }
    const sortedUsers = allServiceProvider
        .map((user) => {
        var _a, _b;
        const distance = (0, serviceProvider_utils_1.default)(currentLet, currentLan, (_a = user.let) !== null && _a !== void 0 ? _a : 0, (_b = user.lan) !== null && _b !== void 0 ? _b : 0);
        return Object.assign(Object.assign({}, user), { distance });
    })
        .sort((a, b) => a.distance - b.distance);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: sortedUsers,
    };
});
const getSingleServiceProvide = (ServiceProviderId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.serviceProvider.findFirst({
        where: { id: ServiceProviderId },
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Service provider not found");
    }
    return result;
});
const myWorkschedule = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.projectApplicants.findMany({
        where: { serviceProviderId: userId, status: "ACCEPTED" },
        select: { clientProject: { select: { date: true, time: true } } },
        orderBy: { clientProject: { date: "desc" } },
    });
    return result;
});
const myProjects = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.serviceProvider.findFirst({
        where: { userId },
    });
    const result = yield prisma_1.default.projectApplicants.findMany({
        where: { serviceProviderId: user === null || user === void 0 ? void 0 : user.id, status: "ACCEPTED" },
        select: {
            clientProject: {
                select: {
                    id: true,
                    title: true,
                    date: true,
                    category: true,
                    status: true,
                    description: true,
                },
            },
        },
        orderBy: { clientProject: { date: "desc" } },
    });
    return result;
});
const myJobs = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.serviceProvider.findFirst({
        where: { userId },
    });
    const result = yield prisma_1.default.jobApplicants.findMany({
        where: { serviceProviderId: user === null || user === void 0 ? void 0 : user.id, status: "ACCEPTED" },
        select: {
            job: {
                select: {
                    id: true,
                    title: true,
                    date: true,
                    category: true,
                    status: true,
                    description: true,
                },
            },
        },
        orderBy: { job: { date: "desc" } },
    });
    return result;
});
const getAllConcierge = () => __awaiter(void 0, void 0, void 0, function* () {
    const resrut = yield prisma_1.default.concierge.findMany({
        select: { id: true, image: true, fullName: true, location: true },
    });
    return resrut;
});
const getSingleConcierge = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const resrut = yield prisma_1.default.concierge.findFirst({
        where: { id },
    });
    return resrut;
});
exports.ServiceProviderService = {
    applyToProject,
    applyToJob,
    getAllServiceProvider,
    getSingleServiceProvide,
    rateServiceProvider,
    myWorkschedule,
    myProjects,
    myJobs,
    getAllConcierge,
    getSingleConcierge,
};
