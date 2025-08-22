// this controller keep request handling lean
// also delegate logic to the functions in service

import {
  getDailyScore as svcGetDailyScore,
  applyAnswer as svcApplyAnswer,
  applyBatch as svcApplyBatch,
  getDailyScoreHistory as svcGetHistory,
} from "../services/dailyScoreService.js";

export const getDailyScore = async (req, res, next) => {
  try {
    const score = await svcGetDailyScore(req.userId);
    res.status(200).json({ dailyScore: score });
  } catch (err) {
    next(err);
  }
};

export const postAnswer = async (req, res, next) => {
  try {
    const { questionId, choiceId } = req.body;
    const score = await svcApplyAnswer(req.userId, questionId, choiceId);
    res.status(200).json({ dailyScore: score });
  } catch (err) {
    next(err);
  }
};

export const postBatch = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const score = await svcApplyBatch(req.userId, answers);
    res.status(200).json({ dailyScore: score });
  } catch (err) {
    next(err);
  }
};

// this handler returns the history of daily scores
export const getHistory = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const history = await svcGetHistory(req.user.id, { limit });
    res.status(200).json({ history });
  } catch (err) {
    next(err);
  }
};
