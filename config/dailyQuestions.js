export const questions = {
  q1: {
    text: "How social do you feel today?",
    choices: {
      a: { text: "Very social", points: { i: 2 } },
      b: { text: "Neutral", points: { S: 1 } },
      c: { text: "Prefer alone", points: { C: 1 } },
    },
  },
  q2: {
    text: "Do you prefer to plan or be spontaneous today?",
    choices: {
      a: { text: "Plan", points: { C: 2 } },
      b: { text: "Spontaneous", points: { D: 1, i: 1 } },
    },
  },
  q3: {
    text: "What pace do you want for today?",
    choices: {
      a: { text: "Fast, decisive", points: { D: 2 } },
      b: { text: "Calm and steady", points: { S: 2 } },
    },
  },
  q4: {
    text: "How budget-conscious are you feeling?",
    choices: {
      a: { text: "Very budget-conscious", points: { C: 1 } },
      b: { text: "Flexible", points: { i: 1 } },
    },
  },
};

// can add more questions q5 or q6 and so.
// Backend uses this file to map questionId + choiceId → contribution to D/i/S/C.
