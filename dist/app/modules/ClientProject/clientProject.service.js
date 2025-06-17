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
const fileUploader_1 = require("../../../helpars/fileUploader");
const clientProject_costant_1 = require("./clientProject.costant");
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
        where: whereConditons,
        skip,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma_1.default.clientProject.count({
        where: whereConditons,
    });
    if (!result || result.length === 0) {
        throw new ApiErrors_1.default(404, "No active ClientProjects found");
    }
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
    });
    return ClientProjectProfile;
});
const updateProfile = (payload, imageFile, ClientProjectId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        let image = "";
        if (imageFile) {
            image = (yield fileUploader_1.fileUploader.uploadToCloudinary(imageFile)).Location;
        }
        const createClientProjectProfile = yield prisma.clientProject.update({
            where: { id: ClientProjectId },
            data: Object.assign({}, payload),
        });
        return createClientProjectProfile;
    }));
    return result;
});
exports.ClientProjectService = {
    createClientProject,
    getClientProjectsFromDb,
    getSingleClientProject,
    updateProfile,
};
