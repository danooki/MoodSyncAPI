import { Router } from "express";
import {
  getMyTrackingBoard,
  getCircleTrackingBoard,
} from "../controllers/trackingBoardController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

// Protect all routes
router.use(verifyToken);

// GET /tracking-board for Tracking Board for the current user's circle (owner case)
router.get("/", getMyTrackingBoard);

// GET /tracking-board/:circleId Tracking board for a specific circle (member case)
router.get("/:circleId", getCircleTrackingBoard);

export default router;
