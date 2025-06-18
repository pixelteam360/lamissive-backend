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
const createClientProject = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.clientProject.create({
        data: Object.assign(Object.assign({}, payload), { userId }),
    });
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
            ProjectApplicants: {
                select: {
                    bidPrice: true,
                    status: true,
                    ServiceProvider: {
                        select: { id: true, image: true, fullName: true },
                    },
                },
            },
        },
    });
    return ClientProjectProfile;
});
const getMyProjects = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.clientProject.findMany({
        where: { userId },
    });
    return result;
});
const confirmApplicant = (payload, projectId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const myProject = yield prisma_1.default.clientProject.findFirst({
        where: { id: projectId, userId },
        select: { id: true },
    });
    if (!myProject) {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "This is not your project");
    }
    const projectApplicants = yield prisma_1.default.projectApplicants.findFirst({
        where: {
            clientProjectId: myProject.id,
            serviceProviderId: payload.serviceProviderId,
        },
        select: { id: true },
    });
    if (!projectApplicants) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Applicant not found");
    }
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
        return updateProject;
    }));
    return result;
});
exports.ClientProjectService = {
    createClientProject,
    getClientProjectsFromDb,
    getSingleClientProject,
    getMyProjects,
    confirmApplicant,
};
