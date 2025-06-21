import { z } from "zod";

const CreateSubscriptionValidationSchema = z.object({
  title: z.string(),
  duration: z.number().int(),
  price: z.number(),
});

const SubscriptionUpdateSchema = z.object({
  title: z.string().optional(),
  duration: z.number().int().optional(),
  price: z.number().optional(),
});

export const SubscriptionValidation = {
  CreateSubscriptionValidationSchema,
  SubscriptionUpdateSchema,
};
