// this file makes the endpoint for today's match
import User from "../models/UserModel.js";
import { getDailyScore } from "./dailyScoreService.js";

// picks the dominant dimension code (e.g., "i"). If tie, return an array of tops.
// for MVP, it picks the first by a fixed order to keep it simple.
function dominantDim(score) {
  const entries = [
    ["D", score.D || 0],
    ["i", score.i || 0],
    ["S", score.S || 0],
    ["C", score.C || 0],
  ];
  entries.sort((a, b) => b[1] - a[1]); // desc
  const topScore = entries[0][1];
  const tops = entries.filter(([, v]) => v === topScore).map(([k]) => k);
  return tops.length ? tops[0] : "S"; // prefer first; default S
}

// very simple suggestion rules by pair (A,B).
function suggestActivities(a, b) {
  const pair = [a, b].sort().join(""); // e.g., "Di" or "SC"

  const ideas = {
    ii: [
      "Go out with friends or a small social event",
      "Cafe hopping or a lively walk in the city",
    ],
    DD: [
      "Competitive game night or a short challenge together",
      "Plan and execute a quick goal-oriented outing",
    ],
    SS: [
      "Cozy night in: cook together, movie, or long walk",
      "Low-effort board game or puzzle",
    ],
    CC: [
      "Quiet, planned activity: museum/library/free exhibit",
      "Budget-friendly meal planning & cook-in",
    ],
    Ci: [
      "Low-cost social activity: free event, picnic, home dinner with friends",
      "Short social outing with a clear budget cap",
    ],
    DS: [
      "Planned but calm: set one clear plan (D) in a relaxing setting (S)",
      "Scenic walk + simple dinner with a reservation",
    ],
    CD: [
      "Efficient errand + treat: plan a short task then reward yourselves",
      "Structured new-restaurant try with reservation/timebox",
    ],
    Si: [
      "Small group hang at home or quiet cafe",
      "Stroll + ice cream; keep it gentle and social",
    ],
    CS: [
      "Board games or documentary at home",
      "Free museum day; calm, budget-conscious",
    ],
    Di: [
      "Energetic but structured: trivia night, reservation at a new spot",
      "Short spontaneous outing with a clear end time",
    ],
  };

  // normalize lookup (make sure both orders map)
  const keyOptions = [pair, pair.split("").reverse().join("")];
  for (const k of keyOptions) if (ideas[k]) return ideas[k];

  // fallback if no specific pair found
  // example
  return [
    "Quick check-in about energy/budget, then pick one activity each: 45 min A’s pick, 45 min B’s pick",
  ];
}

export async function compareToday(userId) {
  // load user to find partner
  const user = await User.findById(userId).select("firstName currentPartner");
  if (!user) {
    const e = new Error("User not found");
    e.status = 404;
    throw e;
  }
  if (!user.currentPartner) {
    const e = new Error("No partner linked");
    e.status = 400;
    throw e;
  }

  const partner = await User.findById(user.currentPartner).select("firstName");
  if (!partner) {
    const e = new Error("Partner not found");
    e.status = 404;
    throw e;
  }

  // makes sure both daily scores are fresh
  const myScore = await getDailyScore(userId);
  const partnerScore = await getDailyScore(partner._id);

  // determine dominant dimensions
  const mine = dominantDim(myScore);
  const theirs = dominantDim(partnerScore);

  // alignment heuristic
  const aligned = mine === theirs;

  // suggest activities
  const suggestions = suggestActivities(mine, theirs);

  return {
    you: {
      id: user._id,
      firstName: user.firstName,
      dailyScore: myScore,
      dominant: mine,
    },
    partner: {
      id: partner._id,
      firstName: partner.firstName,
      dailyScore: partnerScore,
      dominant: theirs,
    },
    aligned,
    suggestions,
  };
}
