// this file makes the endpoint for today's proposals based on circle members
import { getCircleProposals } from "../services/hardProposalService.js";

// GET today proposals based on circle members and daily mood score.
export const getTodayHardProposals = async (req, res, next) => {
  try {
    const result = await getCircleProposals(req.userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
