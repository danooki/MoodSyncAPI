// Public API: orchestrates DB calls + core routines

import User from "../../models/UserModel.js";
import {
  ensureDailyScoreCurrent,
  mapAnswerToPoints,
  selectNextUnansweredQuestion,
} from "./dailyScoreCoreRoutines.js";

// Public API (called from controllers)
export async function getDailyScore(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.cause = 404;
    throw err;
  }

  const { reset } = await ensureDailyScoreCurrent(user);
  if (reset) await user.save();

  return user.dailyScore;
}

// ─────────────────────────────────────────────────────────────
// Apply a single answer (questionId + choiceId) to today's score.
// Prevents double-answering the same question per 12h window.
// ────────────────────────────────────────────────────────────
export async function applyAnswer(userId, questionId, choiceId) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.cause = 404;
    throw err;
  }

  await ensureDailyScoreCurrent(user);

  const alreadyAnswered =
    user.dailyScore.answeredQuestions?.includes(questionId);
  if (alreadyAnswered) {
    const err = new Error("Question already answered today");
    err.cause = 409;
    throw err;
  }

  const delta = mapAnswerToPoints(questionId, choiceId);
  user.dailyScore.D += delta.D || 0;
  user.dailyScore.i += delta.i || 0;
  user.dailyScore.S += delta.S || 0;
  user.dailyScore.C += delta.C || 0;

  user.dailyScore.answeredQuestions.push(questionId);

  await user.save();
  return user.dailyScore;
}

// ─────────────────────────────────────────────────────────────
// Apply a batch of answers at once.
// `answers` = [{ questionId, choiceId }, ...]
// skips duplicates in the payload and rejects if any were already answered today.
// ────────────────────────────────────────────────────────────
export async function applyBatch(userId, answers = []) {
  if (!Array.isArray(answers) || answers.length === 0) {
    const err = new Error("answers must be a non-empty array");
    err.cause = 400;
    throw err;
  }

  // de-duplicate incoming questionIds inside the batch
  const seenInBatch = new Set();
  for (const a of answers) {
    if (!a?.questionId || !a?.choiceId) {
      const err = new Error("Each answer needs questionId and choiceId");
      err.cause = 400;
      throw err;
    }
    if (seenInBatch.has(a.questionId)) {
      const err = new Error("Duplicate questionId in batch");
      err.cause = 400;
      throw err;
    }
    seenInBatch.add(a.questionId);
  }

  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.cause = 404;
    throw err;
  }

  await ensureDailyScoreCurrent(user);

  // prevent applying if any question was already answered today
  const already = (user.dailyScore.answeredQuestions || []).filter((qId) =>
    seenInBatch.has(qId)
  );
  if (already.length) {
    const err = new Error(
      `Some questions already answered today: ${already.join(", ")}`
    );
    err.cause = 409;
    throw err;
  }

  // accumulate deltas then save once
  let deltaD = 0,
    deltai = 0,
    deltaS = 0,
    deltaC = 0;

  for (const { questionId, choiceId } of answers) {
    const delta = mapAnswerToPoints(questionId, choiceId);
    deltaD += delta.D || 0;
    deltai += delta.i || 0;
    deltaS += delta.S || 0;
    deltaC += delta.C || 0;
    user.dailyScore.answeredQuestions.push(questionId);
  }

  user.dailyScore.D += deltaD;
  user.dailyScore.i += deltai;
  user.dailyScore.S += deltaS;
  user.dailyScore.C += deltaC;

  await user.save();
  return user.dailyScore;
}

// ─────────────────────────────────────────────────────────────
// get one question ready to render on the frontend
// ────────────────────────────────────────────────────────────
export async function getNextQuestion(userId, { random = true } = {}) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.cause = 404;
    throw err;
  }

  // Ensure user's daily score is fresh (this may push old score to history)
  const { reset } = await ensureDailyScoreCurrent(user);
  if (reset) await user.save();

  const question = selectNextUnansweredQuestion(user, { random });
  if (!question) {
    return { done: true, message: "All questions answered today" };
  }

  return question;
}

// ─────────────────────────────────────────────────────────────
// GET / daily-score/history
// returns past daily scores.
// ────────────────────────────────────────────────────────────
export async function getDailyScoreHistory(userId, { limit } = {}) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.cause = 404;
    throw err;
  }

  // checks today's score is fresh; if reset happened, it’s now in history.
  const { reset } = await (async () => {
    // reuse existing getDailyScore to trigger reset logic
    await getDailyScore(userId);
    return { reset: false };
  })();

  // refetch to get latest history after potential reset.
  const freshUser = await User.findById(userId).lean();
  let history = freshUser.scoreHistory || [];

  // sort desc by date.
  history = history.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (limit && Number.isInteger(+limit) && +limit > 0) {
    history = history.slice(0, +limit);
  }

  return history;
}
