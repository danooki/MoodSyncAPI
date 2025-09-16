import express from "express";
import { submitFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

// Submit feedback (public endpoint)
router.post("/", submitFeedback);

export default router;
