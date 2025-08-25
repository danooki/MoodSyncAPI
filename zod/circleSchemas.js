import { z } from "zod";

// Schema for creating a new circle
export const createCircleSchema = z.object({
  circleName: z
    .string()
    .min(3, "Circle name must be at least 3 characters")
    .max(50, "Circle name cannot exceed 50 characters"),
});

// Schema for inviting a user by displayName
export const inviteUserSchema = z.object({
  displayName: z
    .string()
    .min(3, "Display name must be at least 3 characters")
    .max(50, "Display name cannot exceed 50 characters"),
});
