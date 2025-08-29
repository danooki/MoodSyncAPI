import matchService from "../services/matchService.js";

export const getMatchPreview = async (req, res, next) => {
  try {
    const userId = req.userId; // injected by verifyToken middleware

    // Call the service to build match preview
    const result = await matchService.getMatchPreview(userId);

    // Return JSON to frontend
    res.status(200).json(result);
  } catch (error) {
    // Forward errors to centralized error handler
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
/**
 * Returns the "Match" screen payload for the current user.
 *   - User must be authenticated (JWT middleware will inject req.userId).
 *   - Circle must exist and all members must have completed their daily questions.
 * Response:
 *   - { allCompleted: boolean, circleMembers: [ ... ] }
 */
// ─────────────────────────────────────────────────────────────
