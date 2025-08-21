// this Schema validates payloads for the answer
// and batch endpoints before hitting the controller

import { z } from "zod";

export const dailyAnswerSchema = z.object({
  questionId: z.string().min(1, "questionId is required"),
  choiceId: z.string().min(1, "choiceId is required"),
});

export const dailyBatchSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        choiceId: z.string().min(1),
      })
    )
    .min(1, "answers must have at least one item"),
});
