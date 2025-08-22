import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { getTodayMatch } from "../controllers/matchController.js";

const router = Router();

router.use(verifyToken);

router.get("/today", getTodayMatch);

export default router;
