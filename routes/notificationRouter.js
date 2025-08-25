import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  listUnreadNotificationsController,
  markNotificationReadController,
} from "../controllers/notificationController.js";

const router = Router();

// Protect all routes
router.use(verifyToken);

// GET /notifications/unread → list all unread notifications for the user
router.get("/unread", listUnreadNotificationsController);

// POST /notifications/:notificationId/read → mark as read
router.post("/:notificationId/read", markNotificationReadController);

export default router;
