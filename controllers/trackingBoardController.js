import * as circleProgressService from "../services/circleProgressService.js";

// ─────────────────────────────────────────────────────────────
// GET /tracking-board: Returns tracking board for current user's circle
// ────────────────────────────────────────────────────────────

export async function getMyTrackingBoard(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id || req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const board = await circleProgressService.getTrackingBoardForUser(userId);
    return res.json(board);
  } catch (err) {
    return next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// GET /tracking-board/:circleId  Returns tracking board for a specific circle (caller must be a member)
// ────────────────────────────────────────────────────────────
export async function getCircleTrackingBoard(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id || req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { circleId } = req.params;
    if (!circleId) return res.status(400).json({ error: "circleId required" });

    const board = await circleProgressService.getTrackingBoardForCircle(
      circleId,
      userId
    );
    return res.json(board);
  } catch (err) {
    return next(err);
  }
}
