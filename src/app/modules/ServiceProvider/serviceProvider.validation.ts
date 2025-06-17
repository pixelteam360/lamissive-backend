import { z } from "zod";

const ApplyToProjectValidation = z.object({
  bidPrice: z.number(),
  clientProjectId: z.string(),
});


export const ServiceProviderValidation = {
  ApplyToProjectValidation,
};
