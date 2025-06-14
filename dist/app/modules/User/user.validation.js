"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const CreateUserValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address").min(1, "Email is required"), // Ensure email is provided and is valid
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
    role: zod_1.z.enum([
        "CLIENT",
        "ADMIN",
        "SERVICE_PROVIDER",
        "EMPLOYER",
        "CONCIERGE",
    ]),
});
const UserLoginValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email is required"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
});
exports.UserValidation = {
    CreateUserValidationSchema,
    UserLoginValidationSchema,
};
