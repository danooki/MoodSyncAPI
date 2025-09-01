// goal: users see if their circle members are compatible based on daily DISC traits before any actual proposals.

import CircleModel from "../models/CircleModel.js";
import UserModel from "../models/UserModel.js";
import * as circleProgressService from "./circleProgressService.js";

const matchTexts = {
  goodMatch: {
    D: "You both love taking charge and leading with confidence!",
    i: "You both bring amazing energy and enthusiasm to everything!",
    S: "You both value peace, harmony, and creating calm spaces.",
    C: "You both appreciate precision, order, and doing things right!",
  },
  goodMatchSingle: {
    D: "You love taking charge and leading with confidence!",
    i: "You bring amazing energy and enthusiasm to everything!",
    S: "You value peace, harmony, and creating calm spaces.",
    C: "You appreciate precision, order, and doing things right!",
  },
  negotiateMatch: {
    D: "Looking for action, challenges, and leadership opportunities.",
    i: "Looking for fun, social vibes, and exciting connections.",
    S: "Looking for calm, comfort, and peaceful activities.",
    C: "Looking for structure, accuracy, and well-planned activities.",
  },
};

// Personality attributes for each DISC trait
const personalityAttributes = {
  D: ["Strong-Willed", "Firm", "Decisive"],
  i: ["Enthusiastic", "Optimistic", "Sociable"],
  S: ["Patient", "Reliable", "Harmonious"],
  C: ["Analytical", "Precise", "Organized"],
};

const getMatchPreview = async (userId) => {
  // 1. fetch the user's circle
  const circle = await CircleModel.findOne({ members: userId }).populate(
    "members"
  );
  if (!circle) throw new Error("User is not part of a circle");

  // 2. check if all members have completed their daily questions
  const trackingBoard = await circleProgressService.getTrackingBoardForCircle(
    circle._id,
    userId
  );
  const allCompleted = trackingBoard.allCompleted;

  if (!allCompleted) {
    return { allCompleted: false, circleMembers: [] };
  }

  // 3. build array of circle members with necessary info
  const circleMembers = await Promise.all(
    circle.members.map(async (member) => {
      const user = await UserModel.findById(member._id);

      // Check if user has dailyScore
      if (!user.dailyScore) {
        console.warn(
          `User ${user._id} (${user.displayName}) missing dailyScore`
        );
        return {
          _id: user._id.toString(),
          displayName: user.displayName,
          avatar: user.avatar,
          primaryScore: null,
          secondaryScore: null,
          interestText: "",
          lookingForText: "",
        };
      }

      // Use pre-computed daily traits (more efficient than recalculating)
      const primary = user.dailyScore.dailyDominantTrait;
      const secondary = user.dailyScore.dailySecondaryTrait;

      return {
        _id: user._id.toString(),
        displayName: user.displayName,
        avatar: user.avatar,
        primaryScore: primary,
        secondaryScore: secondary,
        // Add personality attributes based on primary trait
        attributes: primary ? personalityAttributes[primary] : [],
        // Texts will be computed later
        interestText: "",
        lookingForText: "",
      };
    })
  );

  // 4. Check if this is a single-person circle
  const isSinglePersonCircle = circleMembers.length === 1;

  // 5. Compute match type and generate texts for each member
  // We compare each member with the current user
  const currentUser = circleMembers.find((m) => m._id === userId);

  // Check if current user has valid primary score
  if (!currentUser || !currentUser.primaryScore) {
    console.error(`Current user ${userId} missing primary score`);
    return {
      allCompleted: false,
      circleMembers: [],
      error: "Current user missing daily score data",
    };
  }

  const currentPrimary = currentUser.primaryScore;

  // If single person circle, give them their own insight
  if (isSinglePersonCircle) {
    currentUser.matchType = "goodMatch";
    currentUser.interestText = matchTexts.goodMatchSingle[currentPrimary];
    return {
      allCompleted,
      circleMembers,
      isSinglePersonCircle: true,
    };
  }

  // For multi-person circles, process all members including current user
  circleMembers.forEach((member) => {
    // Skip members without valid primary scores
    if (!member.primaryScore) {
      console.warn(
        `Skipping member ${member._id} (${member.displayName}) - no primary score`
      );
      return;
    }

    if (member._id === userId) {
      // Current user - check the type of match the circle has.
      const hasGoodMatch = circleMembers.some(
        (m) => m._id !== userId && m.primaryScore === currentPrimary
      );

      if (hasGoodMatch) {
        member.matchType = "goodMatch";
        member.interestText = matchTexts.goodMatch[currentPrimary];
      } else {
        member.matchType = "negotiateMatch";
        member.lookingForText = matchTexts.negotiateMatch[currentPrimary];
      }
      return;
    }

    // Other members - check if the type of match the circle has.
    if (member.primaryScore === currentPrimary) {
      // Good match → both get same interest text
      member.matchType = "goodMatch";
      member.interestText = matchTexts.goodMatch[member.primaryScore];
    } else {
      // Negotiate match → each gets their own lookingForText
      member.matchType = "negotiateMatch";
      member.lookingForText = matchTexts.negotiateMatch[member.primaryScore];
    }
  });

  return {
    allCompleted,
    circleMembers,
    isSinglePersonCircle: false,
  };
};

export default { getMatchPreview };
