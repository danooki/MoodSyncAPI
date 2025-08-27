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

// select the next unanswered question for the user.
export function selectNextUnansweredQuestion(user, { random = true } = {}) {
  // questions is expected to be an object keyed by questionId:
  // { Q1: { text, choices: { A: { label, points }, B: { ... } } }, ... }
  const allIds = Object.keys(questions || {});
  const answeredSet = new Set(user.dailyScore?.answeredQuestions || []);
  const unansweredIds = allIds.filter((id) => !answeredSet.has(id));

  if (unansweredIds.length === 0) return null;

  const chosenId = random
    ? unansweredIds[Math.floor(Math.random() * unansweredIds.length)]
    : unansweredIds[0];

  const q = questions[chosenId];

  // map choices to a safe array for the frontend (no points)
  const choices = Object.entries(q.choices || {}).map(([choiceId, ch]) => ({
    choiceId,
    label: ch.label ?? ch.text ?? String(choiceId),
  }));

  return {
    questionId: chosenId,
    text: q.text,
    choices,
  };
}
