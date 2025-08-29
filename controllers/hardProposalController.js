// OBSOLETE
// this file makes the endpoint for today's match
// it uses the matchService to compare today's mood.
import { compareToday } from "../services/hardProposalService.js";

export const getTodayMatch = async (req, res, next) => {
  try {
    const result = await compareToday(req.userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
