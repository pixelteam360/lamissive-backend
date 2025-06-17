"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientProjectValidation = exports.StatusEnum = exports.CategoryEnum = void 0;
const zod_1 = require("zod");
exports.CategoryEnum = zod_1.z.enum([
    "CLEANING",
    "ELECTRICIAN",
    "DRIVING",
    "PLUMBING",
    "MOVING",
    "PAINTING",
    "FARNITURE",
    "LANDSCAPE",
    "OTHERS",
]);
exports.StatusEnum = zod_1.z.enum(["ONGOING", "COMPLETED", "CANCELLED"]);
const CreateClientProjectValidationSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    time: zod_1.z.string(),
    priceRange: zod_1.z.string(),
    category: exports.CategoryEnum,
    status: exports.StatusEnum,
});
const ClientProjectUpdateSchema = zod_1.z.object({
    fullName: zod_1.z.string().optional(),
});
exports.ClientProjectValidation = {
    CreateClientProjectValidationSchema,
    ClientProjectUpdateSchema,
};
