import { z } from "zod";
import { dailyScoreSchema } from "./dailyScoreSchema.js";

// Preferences sub-schema
//must be above everything
const preferencesSchema = z.object({
  notifications: z
    .object({
      dailyReminder: z.boolean().optional(),
      partnerSubmittedAlert: z.boolean().optional(),
    })
    .optional(),
  timezone: z.string().optional(),
});

export const userSchema = z.object({
  displayName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  avatar: z.string().optional(),
  currentPartner: z.string().optional(),
  preferences: preferencesSchema.optional(),
  dailyScore: {
    // Added Aug. 19
    type: dailyScoreSchema,
    default: () => ({
      date: new Date().toISOString(),
      D: 0,
      i: 0,
      S: 0,
      C: 0,
      answeredQuestions: [],
    }),
  },
});

// SIGN UP schema
export const signUpSchema = z.object({
  displayName: z.string().min(3, "Display name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatar: z.string().optional(),
  currentPartner: z.string().optional(), // Mongo ObjectId string
  preferences: preferencesSchema.optional(),
});

// SIGN IN schema
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// CHANGE PASSWORD schema
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Current password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

// UPDATE DISPLAY NAME schema
export const updateDisplayNameSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
});

// UPDATE EMAIL schema
export const updateEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// LEAVE CIRCLE schema (no body needed, just confirmation)
export const leaveCircleSchema = z.object({
  confirm: z
    .boolean()
    .refine((val) => val === true, "You must confirm leaving the circle"),
});
