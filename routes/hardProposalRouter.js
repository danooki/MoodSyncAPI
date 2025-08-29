import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { getTodayMatch } from "../controllers/hardProposalController.js";

const router = Router();

router.use(verifyToken);

router.get("/today", getTodayMatch);

export default router;
