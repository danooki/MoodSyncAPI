// this file defines endpoints, protect with JWT, validate inputs with Zod

import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import validateZod from "../middlewares/validateZod.js";
import {
  dailyAnswerSchema,
  dailyBatchSchema,
} from "../zod/dailyScoreInputSchema.js";
import {
  getDailyScore,
  postAnswer,
  postBatch,
  getHistory,
} from "../controllers/dailyScoreController.js";

const router = Router();

// protect all routes here
router.use(verifyToken);

// GET current (auto-resets if > 12h)
router.get("/", getDailyScore);

// POST one answer
router.post("/answer", validateZod(dailyAnswerSchema), postAnswer);

// POST multiple answers
router.post("/batch", validateZod(dailyBatchSchema), postBatch);

// GET /daily-score/history for daily scores plural
router.get("/history", getHistory);

export default router;
