"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobValidation = exports.CategoryEnum = void 0;
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
const CreateJobValidationSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    priceRange: zod_1.z.string(),
    date: zod_1.z.coerce.date(),
    category: exports.CategoryEnum,
});
const confirmApplicantSchema = zod_1.z.object({
    serviceProviderId: zod_1.z.string(),
});
exports.JobValidation = {
    CreateJobValidationSchema,
    confirmApplicantSchema,
};
