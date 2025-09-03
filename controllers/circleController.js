import {
  createCircle,
  inviteByDisplayName,
  acceptInvite,
  declineInvite,
  getMyCircle,
} from "../services/circleService.js";
import { listMyInvites } from "../services/notificationService.js";

// POST /circle
export async function createCircleController(req, res, next) {
  try {
    const { circleName } = req.body;
    const circle = await createCircle(req.userId, circleName);
    res.status(201).json(circle);
  } catch (err) {
    next(err);
  }
}

// GET /circle/my-circle
export async function getMyCircleController(req, res, next) {
  try {
    const circle = await getMyCircle(req.userId);
    const response = {
      isInCircle: !!circle,
      circleId: circle?._id || null,
      circleName: circle?.circleName || null,
      owner: circle?.owner || null,
      members: circle?.members || [],
      createdAt: circle?.createdAt || null,
      updatedAt: circle?.updatedAt || null,
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

// POST /circle/:circleId/invite
export async function inviteController(req, res, next) {
  try {
    const { displayName } = req.body;
    const { circleId } = req.params;

    console.log("DEBUG Controller - req.userId:", req.userId);
    console.log("DEBUG Controller - circleId:", circleId);

    const invite = await inviteByDisplayName(circleId, req.userId, displayName);
    res.status(201).json(invite);
  } catch (err) {
    next(err);
  }
}

// POST /circle/invite/:inviteId/accept
export async function acceptInviteController(req, res, next) {
  try {
    const { inviteId } = req.params;
    const result = await acceptInvite(inviteId, req.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// POST /circle/invite/:inviteId/decline
export async function declineInviteController(req, res, next) {
  try {
    const { inviteId } = req.params;
    const result = await declineInvite(inviteId, req.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// GET /circle/invites
export async function listInvitesController(req, res, next) {
  try {
    const invites = await listMyInvites(req.userId);
    res.json(invites);
  } catch (err) {
    next(err);
  }
}
