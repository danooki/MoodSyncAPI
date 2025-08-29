// goal: users see if their circle members are compatible based on daily DISC traits before any actual proposals.

import CircleModel from "../models/CircleModel.js";
import UserModel from "../models/UserModel.js";
import * as circleProgressService from "./circleProgressService.js";

const matchTexts = {
  goodMatch: {
    D: "You both enjoy taking initiative",
    i: "You both bring energy and enthusiasm",
    S: "You both value serenity and stability",
    C: "You both appreciate structure and accuracy",
  },
  negotiateMatch: {
    D: "Looking for challenge and leadership",
    i: "Looking for fun and social connection",
    S: "Looking for calm and harmony",
    C: "Looking for precision and order",
  },
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

      return {
        _id: user._id.toString(),
        displayName: user.displayName,
        avatar: user.avatar,
        primaryScore: user.dailyScore.primary,
        secondaryScore: user.dailyScore.secondary,
        // Texts will be computed later
        interestText: "",
        lookingForText: "",
      };
    })
  );

  // 4. Compute match type and generate texts for each member
  // We compare each member with the current user
  const currentUser = circleMembers.find((m) => m._id === userId);
  const currentPrimary = currentUser.primaryScore;

  circleMembers.forEach((member) => {
    if (member._id === userId) return; // skip self

    // Check if primary scores match
    if (member.primaryScore === currentPrimary) {
      // Good match → both get same interest text
      member.matchType = "goodMatch";
      member.interestText = matchTexts.goodMatch[member.primaryScore];
    } else {
      // Negotiate match → each gets their own lookingForText
      member.matchType = "negotiateMatch";
      member.lookingForText = matchTexts.negotiateMatch[member.primaryScore];
      currentUser.lookingForText = matchTexts.negotiateMatch[currentPrimary];
    }
  });

  return {
    allCompleted,
    circleMembers,
  };
};

export default { getMatchPreview };

// ─────────────────────────────────────────────────────────────
/* Backend will provide with:
{
  "allCompleted": true,
  "circleMembers": [
    {
      "displayName": "Alice",
      "avatar": "url_to_avatar",
      "primaryScore": "D",
      "secondaryScore": "i",
      "matchType": "goodMatch",
      "interestText": "You both enjoy taking initiative",
      "lookingForText": null
    },
    {
      "displayName": "Bob",
      "avatar": "url_to_avatar",
      "primaryScore": "C",
      "secondaryScore": "S",
      "matchType": "negotiateMatch",
      "interestText": null,
      "lookingForText": "Looking for creativity"
    }
  ]
}
  */
// ─────────────────────────────────────────────────────────────
