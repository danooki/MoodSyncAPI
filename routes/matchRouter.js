import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { getMatchPreview } from "../controllers/matchController.js";

const router = express.Router();

router.use(verifyToken);

// GET /match/preview
router.get("/preview", getMatchPreview);

export default router;
