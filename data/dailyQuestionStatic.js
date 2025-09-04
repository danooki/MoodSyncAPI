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
      A: {
        label: "Absolutely, let’s go outside and dont be home.",
        weights: { i: 2 },
      },
      B: { label: "Maybe something chill nearby.", weights: { i: 1, S: 1 } },
      C: { label: "Prefer to stay in and recharge.", weights: { S: 2 } },
      D: {
        label: "I can go out but only if it is worth it.",
        weights: { D: 1, C: 1 },
      },
    },
  },
  {
    id: "q2",
    text: "How do you want to handle planning?",
    options: {
      A: {
        label: "I’ll have a strict idea for this evening.",
        weights: { D: 2 },
      },
      B: { label: "Let’s create a plan together", weights: { S: 2 } },
      C: { label: "I’m flexible, go with the flow.", weights: { i: 1, S: 1 } },
      D: {
        label: "I want a clear plan and budget. Please propose something.",
        weights: { C: 2 },
      },
    },
  },
  {
    id: "q3",
    text: "What’s your budget vibe today?",
    options: {
      A: { label: "Low-cost/free is best.", weights: { C: 2 } },
      B: { label: "Open to spend if it’s social.", weights: { i: 2 } },
      C: { label: "Balanced and sensible", weights: { S: 1, C: 1 } },
      D: {
        label: "Worth it if my life is gonna change or do something new.",
        weights: { D: 2 },
      },
    },
  },
  {
    id: "q4",
    text: "Your energy level for this evening?",
    options: {
      A: { label: "High: let’s do something bold.", weights: { D: 1, i: 1 } },
      B: { label: "Medium: easy social plan.", weights: { i: 1, S: 1 } },
      C: { label: "Low: cozy, quiet time.", weights: { S: 2 } },
      D: { label: "Focused on quality over quantity", weights: { C: 2 } },
    },
  },
  {
    id: "q5",
    text: "How do you feel about meeting new people tonight?",
    options: {
      A: {
        label: "Yes! The more strangers, the better.",
        weights: { i: 2 },
      },
      B: {
        label: "Maybe a small group where I feel comfortable.",
        weights: { S: 2 },
      },
      C: {
        label: "Not interested in new faces, let’s keep it private.",
        weights: { C: 2 },
      },
      D: {
        label: "I’ll meet them if it benefits me or my goals.",
        weights: { D: 2 },
      },
    },
  },
  {
    id: "q6",
    text: "What environment sounds best for tonight?",
    options: {
      A: {
        label: "Dynamic, intense, maybe even a little risky.",
        weights: { D: 2 },
      },
      B: {
        label: "Quiet, familiar, and comfortable.",
        weights: { S: 2 },
      },
      C: {
        label: "Organized space where everything makes sense.",
        weights: { C: 2 },
      },
      D: {
        label: "Busy, loud, and full of energy.",
        weights: { i: 2 },
      },
    },
  },
  {
    id: "q7",
    text: "What would make tonight feel successful?",
    options: {
      A: {
        label: "Meeting lots of people and having fun stories.",
        weights: { i: 2 },
      },
      B: {
        label: "Winning, achieving, or pushing my limits.",
        weights: { D: 2 },
      },
      C: {
        label: "Learning something new or doing something useful.",
        weights: { C: 2 },
      },
      D: {
        label: "Spending quality time with people I care about.",
        weights: { S: 2 },
      },
    },
  },
  // Can add more later.
];
