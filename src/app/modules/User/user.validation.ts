import { z } from "zod";

const CreateUserValidationSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"), // Ensure email is provided and is valid
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum([
    "CLIENT",
    "ADMIN",
    "SERVICE_PROVIDER",
    "EMPLOYER",
    "CONCIERGE",
  ]),
  fcmToken: z.string().optional(),
});

const UserLoginValidationSchema = z.object({
  email: z.string().email("Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  fcmToken: z.string().optional(),
});

export const UserValidation = {
  CreateUserValidationSchema,
  UserLoginValidationSchema,
};
