import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  getUsersWithoutCircle,
  getCirclesWithInvalidUsers,
} from "../services/adminService.js";

const router = Router();

// Protect all admin routes with JWT
router.use(verifyToken);

// Hidden endpoint to get users without circles
router.get("/without-circle", async (req, res, next) => {
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

// Hidden endpoint to get circles with invalid/deleted users
router.get("/empty-circles", async (req, res, next) => {
  try {
    const circles = await getCirclesWithInvalidUsers();
    res.json({
      success: true,
      count: circles.length,
      circles: circles,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
