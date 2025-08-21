import { z } from "zod";

// Schema for the dailyScore of a single day
export const dailyScoreSchema = z.object({
  date: z.string(), // ISO string of the date, e.g., '2025-08-19'
  D: z.number().min(0),
  i: z.number().min(0),
  S: z.number().min(0),
  C: z.number().min(0),
  answeredQuestions: z.array(z.string()).optional(), // IDs of questions answered today
});
