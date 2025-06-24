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
exports.ClientProjectService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const clientProject_costant_1 = require("./clientProject.costant");
const http_status_1 = __importDefault(require("http-status"));
const sendNotification_1 = require("../SendNotification/sendNotification");
const createClientProject = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.clientProject.create({
        data: Object.assign(Object.assign({}, payload), { userId }),
    });
    return result;
});
const directHire = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceProvider = yield prisma_1.default.serviceProvider.findFirst({
        where: { id: payload.serviceProviderId },
        select: { id: true },
    });
    if (!serviceProvider) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Service provider not found");
    }
    const notificationData = {
        userId: payload.serviceProviderId,
        title: `You are hire for ${payload.title}`,
        body: payload.description,
    };
    const { bidPrice, serviceProviderId } = payload, restData = __rest(payload, ["bidPrice", "serviceProviderId"]);
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const createProject = yield prisma.clientProject.create({
            data: Object.assign(Object.assign({}, restData), { userId, status: "ONGOING" }),
        });
        yield prisma.projectApplicants.create({
            data: {
                serviceProviderId: payload.serviceProviderId,
                clientProjectId: createProject.id,
                bidPrice: payload.bidPrice,
                status: "ACCEPTED",
            },
        });
        (0, sendNotification_1.sendNotification)(notificationData);
        return createProject;
    }));
    return result;
});
const getClientProjectsFromDb = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: clientProject_costant_1.clientProjectSearchAbleFields.map((field) => ({
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
    const result = yield prisma_1.default.clientProject.findMany({
        where: Object.assign(Object.assign({}, whereConditons), { status: "PENDING" }),
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
    const total = yield prisma_1.default.clientProject.count({
        where: Object.assign(Object.assign({}, whereConditons), { status: "PENDING" }),
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
const getSingleClientProject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const ClientProjectProfile = yield prisma_1.default.clientProject.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    Client: {
                        select: {
                            fullName: true,
                            location: true,
                            image: true,
                            userId: true,
                        },
                    },
                    Employ: {
                        select: {
                            fullName: true,
                            location: true,
                            image: true,
                            userId: true,
                        },
                    },
                },
            },
            ProjectApplicants: {
                where: { status: { not: "REJECTED" } },
                select: {
                    id: true,
                    bidPrice: true,
                    status: true,
                    ServiceProvider: {
                        select: { id: true, image: true, fullName: true, userId: true },
                    },
                },
            },
        },
    });
    return ClientProjectProfile;
});
const getMyProjects = (params, options, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: clientProject_costant_1.clientProjectSearchAbleFields.map((field) => ({
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
    const result = yield prisma_1.default.clientProject.findMany({
        where: Object.assign(Object.assign({}, whereConditons), { userId }),
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
    const total = yield prisma_1.default.clientProject.count({
        where: Object.assign(Object.assign({}, whereConditons), { userId }),
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
const confirmApplicant = (payload, projectId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const myProject = yield prisma_1.default.clientProject.findFirst({
        where: { id: projectId, userId },
        select: { id: true, title: true, description: true },
    });
    if (!myProject) {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "This is not your project");
    }
    const projectApplicants = yield prisma_1.default.projectApplicants.findFirst({
        where: {
            clientProjectId: myProject.id,
            serviceProviderId: payload.serviceProviderId,
        },
        select: {
            id: true,
            ServiceProvider: { select: { user: { select: { id: true } } } },
        },
    });
    if (!projectApplicants) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Applicant not found");
    }
    const notificationData = {
        userId: projectApplicants.ServiceProvider.user.id,
        title: `Project application accepted for ${myProject.title}`,
        body: myProject.description,
    };
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const updateProject = yield prisma.clientProject.update({
            where: { id: myProject.id },
            data: { status: "ONGOING" },
        });
        yield prisma.projectApplicants.update({
            where: { id: projectApplicants.id },
            data: { status: "ACCEPTED" },
        });
        yield prisma.projectApplicants.deleteMany({
            where: { clientProjectId: myProject.id, status: { not: "ACCEPTED" } },
        });
        (0, sendNotification_1.sendNotification)(notificationData);
        return updateProject;
    }));
    return result;
});
const rejectApplicant = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.projectApplicants.update({
        where: { id },
        data: { status: "REJECTED" },
        select: {
            id: true,
            status: true,
            ServiceProvider: { select: { user: { select: { id: true } } } },
            clientProject: { select: { title: true } },
        },
    });
    const notificationData = {
        userId: result.ServiceProvider.user.id,
        title: `Project application rejected for ${result.clientProject.title}`,
        body: "",
    };
    (0, sendNotification_1.sendNotification)(notificationData);
    return result;
});
const cancelProject = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const clientProject = yield prisma_1.default.clientProject.findFirst({
        where: { id, userId },
        select: {
            id: true,
            title: true,
            ProjectApplicants: {
                select: {
                    ServiceProvider: { select: { user: { select: { id: true } } } },
                },
            },
        },
    });
    if (!clientProject) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Unauthorize access");
    }
    const result = yield prisma_1.default.clientProject.update({
        where: { id, userId },
        data: { status: "CANCELLED" },
    });
    const notificationData = {
        userId: clientProject.ProjectApplicants[0].ServiceProvider.user.id,
        title: `Project cancelled from ${clientProject.title}`,
        body: "",
    };
    (0, sendNotification_1.sendNotification)(notificationData);
    return result;
});
exports.ClientProjectService = {
    createClientProject,
    getClientProjectsFromDb,
    getSingleClientProject,
    getMyProjects,
    confirmApplicant,
    rejectApplicant,
    cancelProject,
    directHire,
};
