import { z } from "zod";

const FeesSchema = z.object({
  jobFee: z.number().min(0, "Job fee must be a positive number"),
  projectFee: z.number().min(0, "Project fee must be a positive number"),
});
const UpdateFeesSchema = z.object({
  jobFee: z.number().min(0, "Job fee must be a positive number").optional(),
  projectFee: z
    .number()
    .min(0, "Project fee must be a positive number")
    .optional(),
});

export const DashboardValidation = {
  FeesSchema,
  UpdateFeesSchema,
};
