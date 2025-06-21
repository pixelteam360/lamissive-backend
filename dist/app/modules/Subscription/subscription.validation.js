"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionValidation = void 0;
const zod_1 = require("zod");
const CreateSubscriptionValidationSchema = zod_1.z.object({
    title: zod_1.z.string(),
    duration: zod_1.z.number().int(),
    price: zod_1.z.number(),
});
const SubscriptionUpdateSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    duration: zod_1.z.number().int().optional(),
    price: zod_1.z.number().optional(),
});
exports.SubscriptionValidation = {
    CreateSubscriptionValidationSchema,
    SubscriptionUpdateSchema,
};
