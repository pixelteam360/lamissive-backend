"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientProjectValidation = exports.CategoryEnum = void 0;
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
const CreateClientProjectValidationSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    time: zod_1.z.string(),
    priceRange: zod_1.z.string(),
    category: exports.CategoryEnum,
});
const confirmApplicantSchema = zod_1.z.object({
    serviceProviderId: zod_1.z.string(),
});
exports.ClientProjectValidation = {
    CreateClientProjectValidationSchema,
    confirmApplicantSchema,
};
