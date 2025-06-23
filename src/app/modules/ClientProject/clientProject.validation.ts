import { z } from "zod";

export const CategoryEnum = z.enum([
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

const CreateClientProjectValidationSchema = z.object({
  title: z.string(),
  description: z.string(),
  time: z.string(),
  priceRange: z.string(),
  category: CategoryEnum,
});

const confirmApplicantSchema = z.object({
  serviceProviderId: z.string(),
});

const directHireValidationSchema = z.object({
  title: z.string(),
  description: z.string(),
  time: z.string(),
  priceRange: z.string(),
  category: CategoryEnum,
  serviceProviderId: z.string(),
  bidPrice: z.number(),
});

export const ClientProjectValidation = {
  CreateClientProjectValidationSchema,
  confirmApplicantSchema,
  directHireValidationSchema
};
