import { questions } from "../../config/dailyQuestions.js";
import {
  isStale,
  freshDailyScore,
  toHistoryEntry,
} from "../../utils/dailyScoreUtils.js";

// Ensure the current user's daily score is up to date.
export async function ensureDailyScoreCurrent(user, now = new Date()) {
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
export function mapAnswerToPoints(questionId, choiceId) {
  const q = questions[questionId];
  if (!q) throw httpError("Unknown questionId", 400);

  const choice = q.choices[choiceId];
  if (!choice) throw httpError("Unknown choiceId", 400);

  // choice.points like { D: 1, i: 2 }
  return choice.points || {};
}
