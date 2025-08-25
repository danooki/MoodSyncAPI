import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  createCircleController,
  getMyCircleController,
  inviteController,
  acceptInviteController,
  declineInviteController,
  listInvitesController,
} from "../controllers/circleController.js";

const router = Router();

// Protect all routes
router.use(verifyToken);

router.post("/", createCircleController);
router.get("/my-circle", getMyCircleController);
router.post("/:circleId/invite", inviteController);
router.post("/invite/:inviteId/accept", acceptInviteController);
router.post("/invite/:inviteId/decline", declineInviteController);
router.get("/invites", listInvitesController);

export default router;
