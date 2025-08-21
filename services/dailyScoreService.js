import User from "../models/UserModel.js";
import { questions } from "../config/dailyQuestions.js";

/** ─────────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────────*/
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

// checking if the daily score is stale.
function isStale(dailyScore, now = new Date()) {
  if (!dailyScore?.date) return true;
  return now.getTime() - new Date(dailyScore.date).getTime() >= TWELVE_HOURS_MS;
}

// checking if the question is answered today.
function freshDailyScore(now = new Date()) {
  return { date: now, D: 0, i: 0, S: 0, C: 0, answeredQuestions: [] };
}

function toHistoryEntry(dailyScore) {
  // Create a plain snapshot to push to history
  return {
    date: dailyScore.date,
    D: dailyScore.D,
    i: dailyScore.i,
    S: dailyScore.S,
    C: dailyScore.C,
    answeredQuestions: [...(dailyScore.answeredQuestions || [])],
  };
}

// update the user's daily score.
function httpError(message, status = 400) {
  const err = new Error(message, { cause: status });
  err.status = status;
  return err;
}

/** ─────────────────────────────────────────────────────────────
 * Core routines (kept private to this module)
 * ────────────────────────────────────────────────────────────*/

// Ensure the current user's daily score is up to date.
async function ensureDailyScoreCurrent(user, now = new Date()) {
  if (!user.dailyScore) {
    user.dailyScore = freshDailyScore(now);
    return { user, reset: true };
  }

  if (isStale(user.dailyScore, now)) {
    // Move previous score to history before resetting
    user.scoreHistory = user.scoreHistory || [];
    user.scoreHistory.push(toHistoryEntry(user.dailyScore));
    user.dailyScore = freshDailyScore(now);
    return { user, reset: true };
  }

  return { user, reset: false };
}

// update the user's daily score based on their answers.
function mapAnswerToPoints(questionId, choiceId) {
  const q = questions[questionId];
  if (!q) throw httpError("Unknown questionId", 400);

  const choice = q.choices[choiceId];
  if (!choice) throw httpError("Unknown choiceId", 400);

  // choice.points like { D: 1, i: 2 }
  return choice.points || {};
}

/** ─────────────────────────────────────────────────────────────
 * Public API (called from controllers)
 * ────────────────────────────────────────────────────────────*/

//
export async function getDailyScore(userId) {
  const user = await User.findById(userId);
  if (!user) throw httpError("User not found", 404);

  const { reset } = await ensureDailyScoreCurrent(user);
  if (reset) await user.save();

  return user.dailyScore;
}

/**
 * Apply a single answer (questionId + choiceId) to today's score.
 * Prevents double-answering the same question per 12h window.
 */
export async function applyAnswer(userId, questionId, choiceId) {
  const user = await User.findById(userId);
  if (!user) throw httpError("User not found", 404);

  await ensureDailyScoreCurrent(user);

  const alreadyAnswered =
    user.dailyScore.answeredQuestions?.includes(questionId);
  if (alreadyAnswered) {
    throw httpError("Question already answered today", 409);
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

/**
 * Apply a batch of answers in one go.
 * `answers` = [{ questionId, choiceId }, ...]
 * Skips duplicates in the payload and rejects if any were already answered today.
 */
export async function applyBatch(userId, answers = []) {
  if (!Array.isArray(answers) || answers.length === 0) {
    throw httpError("answers must be a non-empty array", 400);
  }

  // de-duplicate incoming questionIds inside the batch
  const seenInBatch = new Set();
  for (const a of answers) {
    if (!a?.questionId || !a?.choiceId) {
      throw httpError("Each answer needs questionId and choiceId", 400);
    }
    if (seenInBatch.has(a.questionId)) {
      throw httpError("Duplicate questionId in batch", 400);
    }
    seenInBatch.add(a.questionId);
  }

  const user = await User.findById(userId);
  if (!user) throw httpError("User not found", 404);

  await ensureDailyScoreCurrent(user);

  // prevent applying if any question was already answered today
  const already = (user.dailyScore.answeredQuestions || []).filter((qId) =>
    seenInBatch.has(qId)
  );
  if (already.length) {
    throw httpError(
      `Some questions already answered today: ${already.join(", ")}`,
      409
    );
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
