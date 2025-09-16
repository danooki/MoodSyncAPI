import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  getUsersWithoutCircle,
  getEmptyCircles,
} from "../services/adminService.js";
import { getAllFeedback } from "../controllers/feedbackController.js";

const router = Router();

// all this routes use the HIDDEN_ADMIN_ENDPOINT which is in the env file (for complete route)

// Protect all admin routes with JWT
router.use(verifyToken);

// Get users without circles
router.get("/users/without-circle", async (req, res, next) => {
  try {
    const users = await getUsersWithoutCircle();
    res.json({
      success: true,
      count: users.length,
      users: users.map((user) => ({
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// Get empty circles
router.get("/users/empty-circles", async (req, res, next) => {
  try {
    const emptyCircles = await getEmptyCircles();
    res.json({
      success: true,
      count: emptyCircles.length,
      circles: emptyCircles.map((circle) => ({
        _id: circle._id,
        circleName: circle.circleName,
        memberCount: circle.members ? circle.members.length : 0,
        createdAt: circle.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// Get all feedback (admin only)
router.get("/feedback", getAllFeedback);

export default router;
