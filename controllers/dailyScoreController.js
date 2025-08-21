// this controller keep request handling lean
// also delegate logic to the functions in service

import {
  getDailyScore as svcGetDailyScore,
  applyAnswer as svcApplyAnswer,
  applyBatch as svcApplyBatch,
} from "../services/dailyScoreService.js";

export const getDailyScore = async (req, res, next) => {
  try {
    const score = await svcGetDailyScore(req.user.id);
    res.status(200).json({ dailyScore: score });
  } catch (err) {
    next(err);
  }
};

export const postAnswer = async (req, res, next) => {
  try {
    const { questionId, choiceId } = req.body;
    const score = await svcApplyAnswer(req.user.id, questionId, choiceId);
    res.status(200).json({ dailyScore: score });
  } catch (err) {
    next(err);
  }
};

export const postBatch = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const score = await svcApplyBatch(req.user.id, answers);
    res.status(200).json({ dailyScore: score });
  } catch (err) {
    next(err);
  }
};
