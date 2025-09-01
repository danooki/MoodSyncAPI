// this file makes the endpoint for today's proposals based on circle members
import User from "../models/UserModel.js";
import CircleModel from "../models/CircleModel.js";
import { getDailyScore } from "./dailyScore/dailyScoreService.js";
import * as circleProgressService from "./circleProgressService.js";
import { getPrimaryAndSecondary } from "../utils/dailyScoreUtils.js";

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
  return [
    "Quick check-in about energy/budget, then pick one activity each: 45 min A's pick, 45 min B's pick",
  ];
}

// Generate group activities based on all circle members' personalities
function generateGroupActivities(circleMembers) {
  const memberCount = circleMembers.length;
  const dominants = circleMembers.map((m) => m.dominant);

  // Count each dominant trait
  const traitCounts = dominants.reduce((acc, trait) => {
    acc[trait] = (acc[trait] || 0) + 1;
    return acc;
  }, {});

  // Find the most common trait
  const mostCommonTrait = Object.entries(traitCounts).sort(
    ([, a], [, b]) => b - a
  )[0][0];

  // Generate group-specific suggestions
  const groupSuggestions = {
    // All same trait
    unanimous: {
      D: [
        "Group challenge or competition: escape room, trivia night, or team sports",
        "Plan and execute a group project or goal-oriented activity",
      ],
      i: [
        "Social gathering: party, group dinner, or outdoor adventure",
        "Interactive group activity: karaoke, group games, or social event",
      ],
      S: [
        "Relaxing group activity: movie night, board games, or peaceful outing",
        "Low-pressure social: potluck dinner, casual hangout, or gentle activities",
      ],
      C: [
        "Structured group activity: museum visit, organized tour, or planned event",
        "Efficient group task with clear organization and planning",
      ],
    },
    // Mixed traits
    mixed: [
      "Rotating activity night: each person picks one activity for 30 minutes",
      "Compromise activity: find something that accommodates everyone's energy levels",
      "Split into smaller groups based on similar interests, then reconvene",
      "Progressive dinner or activity: start calm, build energy, then wind down",
    ],
  };

  // Check if all members have the same dominant trait
  const isUnanimous = Object.values(traitCounts).some(
    (count) => count === memberCount
  );

  if (isUnanimous) {
    return groupSuggestions.unanimous[mostCommonTrait];
  } else {
    return groupSuggestions.mixed;
  }
}

export async function getCircleProposals(userId) {
  // 1. fetch the user's circle
  const circle = await CircleModel.findOne({ members: userId }).populate(
    "members"
  );
  if (!circle) {
    const e = new Error("User is not part of a circle");
    e.status = 400;
    throw e;
  }

  // 2. check if all members have completed their daily questions
  const trackingBoard = await circleProgressService.getTrackingBoardForCircle(
    circle._id,
    userId
  );
  const allCompleted = trackingBoard.allCompleted;

  if (!allCompleted) {
    return {
      allCompleted: false,
      message: "All circle members must complete daily questions first",
      circleMembers: [],
      proposals: [],
    };
  }

  // 3. build array of circle members with their daily scores
  const circleMembers = await Promise.all(
    circle.members.map(async (member) => {
      const user = await User.findById(member._id);
      const dailyScore = await getDailyScore(user._id);
      const dominant = dailyScore.dailyDominantTrait || dominantDim(dailyScore);

      return {
        id: user._id,
        displayName: user.displayName,
        avatar: user.avatar,
        dailyScore,
        dominant,
      };
    })
  );

  // 4. Generate proposals based on circle size
  let proposals = [];

  if (circleMembers.length === 1) {
    // Single person circle - self-focused activities
    const member = circleMembers[0];
    proposals = [
      "Self-care day: treat yourself to something you enjoy",
      "Personal project time: work on something meaningful to you",
      "Solo adventure: explore a new place or try something new",
    ];
  } else if (circleMembers.length === 2) {
    // Two person circle - use existing pair logic
    const [member1, member2] = circleMembers;
    proposals = suggestActivities(member1.dominant, member2.dominant);
  } else {
    // Multi-person circle - generate group activities
    proposals = generateGroupActivities(circleMembers);
  }

  // 5. Generate pair-wise compatibility insights
  const pairInsights = [];
  if (circleMembers.length > 1) {
    for (let i = 0; i < circleMembers.length; i++) {
      for (let j = i + 1; j < circleMembers.length; j++) {
        const member1 = circleMembers[i];
        const member2 = circleMembers[j];
        const pairSuggestions = suggestActivities(
          member1.dominant,
          member2.dominant
        );

        pairInsights.push({
          members: [member1.displayName, member2.displayName],
          dominantTraits: [member1.dominant, member2.dominant],
          aligned: member1.dominant === member2.dominant,
          suggestions: pairSuggestions,
        });
      }
    }
  }

  return {
    allCompleted: true,
    circleMembers,
    proposals,
    pairInsights,
    circleInfo: {
      id: circle._id,
      name: circle.circleName,
      memberCount: circleMembers.length,
    },
  };
}
