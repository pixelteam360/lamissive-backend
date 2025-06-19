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

const CreateJobValidationSchema = z.object({
  title: z.string(),
  description: z.string(),
  priceRange: z.string(),
  date: z.coerce.date(),
  category: CategoryEnum,
});

const confirmApplicantSchema = z.object({
  serviceProviderId: z.string(),
});


export const JobValidation = {
  CreateJobValidationSchema,
  confirmApplicantSchema,
};
