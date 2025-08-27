// this controller keep request handling lean
// also delegate logic to the functions in service

import {
  getDailyScore as svcGetDailyScore,
  applyAnswer as svcApplyAnswer,
  applyBatch as svcApplyBatch,
  getDailyScoreHistory as svcGetHistory,
  getNextQuestion,
} from "../services/dailyScore/dailyScoreService.js";

export const getDailyScore = async (req, res, next) => {
  try {
    const score = await svcGetDailyScore(req.userId);
    res.status(200).json({ dailyScore: score });
  } catch (err) {
    next(err);
  }
};

// for GET /daily-score/next-question
export async function getNextQuestionHandler(req, res, next) {
  try {
    // token middleware should attach the authenticated user; adapt to your shape
    const userId =
      req.user?.id || req.user?.userId || req.userId || req.user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // query param: ?random=false to enforce sequential
    const random = req.query.random === "false" ? false : true;

    const payload = await dailyScoreService.getNextQuestion(userId, { random });
    return res.json(payload);
  } catch (err) {
    return next(err);
  }
}

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
