import { z } from "zod";

export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
export const ExpertiseEnum = z.enum([
  "CLEANING",
  "ELECTRICIAN",
  "DRIVING",
  "PLUMBING",
  "MOVING",
  "PAINTING",
  "FURNITURE",
  "LANDSCAPE",
  "OTHERS",
]);

export const ClientProfileSchema = z.object({
  fullName: z.string(),
  location: z.string(),
  gender: GenderEnum,
  age: z.number().int(),
  let: z.number(),
  lan: z.number(),
});

export const UpdateClientProfileSchema = z.object({
  fullName: z.string().optional(),
  location: z.string().optional(),
  gender: GenderEnum.optional(),
  age: z.number().int().optional(),
  let: z.number().optional(),
  lan: z.number().optional(),
});

export const EmployerProfileSchema = z.object({
  fullName: z.string(),
  location: z.string(),
  let: z.number(),
  lan: z.number(),
});

export const UpdateEmployerProfileSchema = z.object({
  fullName: z.string().optional(),
  location: z.string().optional(),
  let: z.number().optional(),
  lan: z.number().optional(),
});

export const ServiceProviderProfileSchema = z.object({
  fullName: z.string(),
  location: z.string(),
  gender: GenderEnum,
  age: z.number().int(),
  exprience: z.number().int(),
  expertise: z.array(ExpertiseEnum),
  mobile: z.string(),
  hourlyRate: z.number(),
  int: z.number(),
  let: z.number(),
  lan: z.number(),
});

export const UpdateServiceProviderProfileSchema = z.object({
  fullName: z.string().optional(),
  location: z.string().optional(),
  gender: GenderEnum.optional(),
  age: z.number().int().optional(),
  exprience: z.number().int().optional(),
  expertise: z.string().optional(),
  mobile: z.string().optional(),
  let: z.number().optional(),
  lan: z.number().optional(),
});

export const ConciergeProfileSchema = z.object({
  fullName: z.string(),
  location: z.string(),
  gender: GenderEnum,
  age: z.number().int(),
  exprience: z.number().int(),
  let: z.number(),
  lan: z.number(),
});

export const UpdateConciergeProfileSchema = z.object({
  fullName: z.string().optional(),
  location: z.string().optional(),
  gender: GenderEnum.optional(),
  age: z.number().int().optional(),
  exprience: z.number().int().optional(),
  let: z.number().optional(),
  lan: z.number().optional(),
});

export const UserProfileValidation = {
  ClientProfileSchema,
  UpdateClientProfileSchema,
  EmployerProfileSchema,
  UpdateEmployerProfileSchema,
  ServiceProviderProfileSchema,
  UpdateServiceProviderProfileSchema,
  ConciergeProfileSchema,
  UpdateConciergeProfileSchema
};
