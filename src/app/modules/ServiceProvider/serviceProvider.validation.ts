import { z } from "zod";

const ApplyToProjectValidation = z.object({
  bidPrice: z.number(),
  clientProjectId: z.string(),
});

const rateServiceSchema = z.object({
  serviceProviderId: z.string(),
  rating: z.number(),
});

export const ServiceProviderValidation = {
  ApplyToProjectValidation,
  rateServiceSchema,
};
