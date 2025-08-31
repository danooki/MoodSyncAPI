import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { getTodayHardProposals } from "../controllers/hardProposalController.js";

const router = Router();

router.use(verifyToken);

router.get("/today", getTodayHardProposals);

export default router;
