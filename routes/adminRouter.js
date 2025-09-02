import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { getUsersWithoutCircle } from "../services/adminService.js";

const router = Router();

// Protect all admin routes with JWT
router.use(verifyToken);

// Hidden endpoint to get users without circles
router.get("/", async (req, res, next) => {
  try {
    const users = await getUsersWithoutCircle();
    res.json({
      success: true,
      count: users.length,
      users: users.map((user) => ({
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        createdAt: user.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
