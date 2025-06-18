"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProviderValidation = void 0;
const zod_1 = require("zod");
const ApplyToProjectValidation = zod_1.z.object({
    bidPrice: zod_1.z.number(),
    clientProjectId: zod_1.z.string(),
});
const rateServiceSchema = zod_1.z.object({
    serviceProviderId: zod_1.z.string(),
    rating: zod_1.z.number(),
});
exports.ServiceProviderValidation = {
    ApplyToProjectValidation,
    rateServiceSchema,
};
