// this file makes the endpoint for today's match
// it uses the matchService to compare today's mood.
import { compareToday } from "../services/matchService.js";

export const getTodayMatch = async (req, res, next) => {
  try {
    const result = await compareToday(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
