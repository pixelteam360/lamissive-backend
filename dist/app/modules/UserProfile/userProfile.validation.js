"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileValidation = exports.UpdateServiceProviderProfileSchema = exports.ServiceProviderProfileSchema = exports.UpdateEmployerProfileSchema = exports.EmployerProfileSchema = exports.UpdateClientProfileSchema = exports.ClientProfileSchema = exports.GenderEnum = void 0;
const zod_1 = require("zod");
exports.GenderEnum = zod_1.z.enum(["MALE", "FEMALE", "OTHER"]);
exports.ClientProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string(),
    location: zod_1.z.string(),
    gender: exports.GenderEnum,
    age: zod_1.z.number().int(),
    let: zod_1.z.number(),
    lan: zod_1.z.number(),
});
exports.UpdateClientProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    gender: exports.GenderEnum.optional(),
    age: zod_1.z.number().int().optional(),
    let: zod_1.z.number().optional(),
    lan: zod_1.z.number().optional(),
});
exports.EmployerProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string(),
    location: zod_1.z.string(),
    let: zod_1.z.number(),
    lan: zod_1.z.number(),
});
exports.UpdateEmployerProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    let: zod_1.z.number().optional(),
    lan: zod_1.z.number().optional(),
});
exports.ServiceProviderProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string(),
    location: zod_1.z.string(),
    gender: exports.GenderEnum,
    age: zod_1.z.number().int(),
    exprience: zod_1.z.number().int(),
    expertise: zod_1.z.string(),
    mobile: zod_1.z.string(),
    let: zod_1.z.number(),
    lan: zod_1.z.number(),
});
exports.UpdateServiceProviderProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    gender: exports.GenderEnum.optional(),
    age: zod_1.z.number().int().optional(),
    exprience: zod_1.z.number().int().optional(),
    expertise: zod_1.z.string().optional(),
    mobile: zod_1.z.string().optional(),
    let: zod_1.z.number().optional(),
    lan: zod_1.z.number().optional(),
});
exports.UserProfileValidation = {
    ClientProfileSchema: exports.ClientProfileSchema,
    UpdateClientProfileSchema: exports.UpdateClientProfileSchema,
    EmployerProfileSchema: exports.EmployerProfileSchema,
    UpdateEmployerProfileSchema: exports.UpdateEmployerProfileSchema,
    ServiceProviderProfileSchema: exports.ServiceProviderProfileSchema,
    UpdateServiceProviderProfileSchema: exports.UpdateServiceProviderProfileSchema,
};
