export const DISC_DIMENSIONS = {
  D: "dominance",
  i: "influence",
  S: "steadiness",
  C: "conscientiousness",
};

export const QUESTION_BANK = [
  {
    id: "q1",
    text: "How do you feel about going out this evening?",
    options: {
      A: { label: "Absolutely, let’s go!", weights: { i: 2 } },
      B: { label: "Maybe something chill nearby", weights: { i: 1, S: 1 } },
      C: { label: "Prefer to stay in and recharge", weights: { S: 2 } },
      D: {
        label: "Only if it’s efficient and worth it",
        weights: { D: 1, C: 1 },
      },
    },
  },
  {
    id: "q2",
    text: "How do you want to handle planning?",
    options: {
      A: { label: "I’ll lead and decide", weights: { D: 2 } },
      B: { label: "Let’s co-create plans", weights: { S: 2 } },
      C: { label: "I’m flexible, go with the flow", weights: { i: 1, S: 1 } },
      D: { label: "I want a clear plan and budget", weights: { C: 2 } },
    },
  },
  {
    id: "q3",
    text: "What’s your budget vibe today?",
    options: {
      A: { label: "Low-cost/free is best", weights: { C: 2 } },
      B: { label: "Open to spend if it’s social", weights: { i: 2 } },
      C: { label: "Balanced and sensible", weights: { S: 1, C: 1 } },
      D: { label: "Worth it if it achieves a goal", weights: { D: 2 } },
    },
  },
  {
    id: "q4",
    text: "Your energy level?",
    options: {
      A: { label: "High: let’s do something bold", weights: { D: 1, i: 1 } },
      B: { label: "Medium: easy social plan", weights: { i: 1, S: 1 } },
      C: { label: "Low: cozy, quiet time", weights: { S: 2 } },
      D: { label: "Focused on quality over quantity", weights: { C: 2 } },
    },
  },

  // Can add more later.
];
