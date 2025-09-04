import { QUESTION_BANK } from "../../data/dailyQuestionStatic.js";
import {
  isStale,
  freshDailyScore,
  toHistoryEntry,
} from "../../utils/dailyScoreUtils.js";

// Ensure the current user's daily score is up to date.
export async function ensureDailyScoreCurrent(user, now = new Date()) {
  if (!user.dailyScore) {
    user.dailyScore = freshDailyScore(now);
    // Initialize with empty selected questions (will be set when first question is requested)
    user.dailyScore.selectedQuestions = [];
    return { user, reset: true };
  }

  if (isStale(user.dailyScore, now)) {
    // Move previous score to history before resetting
    user.scoreHistory = user.scoreHistory || [];
    user.scoreHistory.push(toHistoryEntry(user.dailyScore));
    user.dailyScore = freshDailyScore(now);
    // Reset selected questions for new day
    user.dailyScore.selectedQuestions = [];
    return { user, reset: true };
  }

  return { user, reset: false };
}

// update the user's daily score based on their answers.
export function mapAnswerToPoints(questionId, choiceId) {
  const q = QUESTION_BANK.find((question) => question.id === questionId);
  if (!q) {
    const err = new Error("Unknown questionId");
    err.cause = 400;
    throw err;
  }

  const choice = q.options[choiceId];
  if (!choice) {
    const err = new Error("Unknown choiceId");
    err.cause = 400;
    throw err;
  }

  // choice.weights like { D: 1, i: 2 }
  return choice.weights || {};
}

// select the next unanswered question for the user.
export function selectNextUnansweredQuestion(user, { random = true } = {}) {
  // Check if we need to select daily questions (first time or reset)
  if (
    !user.dailyScore.selectedQuestions ||
    user.dailyScore.selectedQuestions.length === 0
  ) {
    // Select exactly 4 random questions for today
    const allIds = QUESTION_BANK.map((question) => question.id);
    const shuffledIds = [...allIds].sort(() => Math.random() - 0.5);
    user.dailyScore.selectedQuestions = shuffledIds.slice(0, 4);
  }

  // Get unanswered questions from the selected 4 questions
  const answeredSet = new Set(user.dailyScore?.answeredQuestions || []);
  const unansweredIds = user.dailyScore.selectedQuestions.filter(
    (id) => !answeredSet.has(id)
  );

  if (unansweredIds.length === 0) return null;

  const chosenId = random
    ? unansweredIds[Math.floor(Math.random() * unansweredIds.length)]
    : unansweredIds[0];

  const q = QUESTION_BANK.find((question) => question.id === chosenId);

  // map choices to a safe array for the frontend (no weights)
  const choices = Object.entries(q.options || {}).map(([choiceId, ch]) => ({
    choiceId,
    label: ch.label,
  }));

  return {
    questionId: chosenId,
    text: q.text,
    choices,
  };
}
