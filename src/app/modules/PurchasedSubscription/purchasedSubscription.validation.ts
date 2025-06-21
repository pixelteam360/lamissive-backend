import { z } from "zod";

const CreatePurchasedSubscriptionValidationSchema = z.object({
  subscriptionId: z.string(),
  paymentId: z.string(),
});

export const PurchasedSubscriptionValidation = {
  CreatePurchasedSubscriptionValidationSchema,
};
