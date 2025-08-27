// Helpers
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

// checking if the daily score is stale.
export function isStale(dailyScore, now = new Date()) {
  if (!dailyScore?.date) return true;
  return now.getTime() - new Date(dailyScore.date).getTime() >= TWELVE_HOURS_MS;
}

// Return a fresh daily score object
// checking if the question is answered today.
export function freshDailyScore(now = new Date()) {
  return { date: now, D: 0, i: 0, S: 0, C: 0, answeredQuestions: [] };
}

export function toHistoryEntry(dailyScore) {
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

// ─────────────────────────────────────────────
// to interpret a dailyScore
// ─────────────────────────────────────────────

export function getPrimaryAndSecondary(dailyScore) {
  if (!dailyScore) return { primary: null, secondary: null };

  const entries = [
    { key: "D", value: dailyScore.D || 0 },
    { key: "i", value: dailyScore.i || 0 },
    { key: "S", value: dailyScore.S || 0 },
    { key: "C", value: dailyScore.C || 0 },
  ];

  // sort high → low
  entries.sort((a, b) => b.value - a.value);

  return {
    primary: entries[0].key,
    secondary: entries[1].key,
  };
}
