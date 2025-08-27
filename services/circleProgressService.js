import User from "../models/UserModel.js";
import * as circleService from "./circleService.js";

// ─────────────────────────────────────────────────────────────
// Build a tracking board object for a circle.
// @param {Object} circle - circle document (lean or mongoose doc) with members array of IDs.
// @returns {Promise<Object>} tracking board skeleton (without member statuses).
// ────────────────────────────────────────────────────────────

async function buildTrackingBoard(circle) {
  // Load members with only the fields we need
  const members = await User.find({ _id: { $in: circle.members } })
    .select("displayName avatar dailyScore")
    .lean();

  // Map to status objects
  const memberStatus = members.map((m) => {
    const answered = Array.isArray(m.dailyScore?.answeredQuestions)
      ? m.dailyScore.answeredQuestions.length
      : 0;
    return {
      _id: m._id,
      displayName: m.displayName,
      avatar: m.avatar,
      answeredCount: answered,
      status: answered >= 4 ? "Completed" : "Pending",
    };
  });

  const allCompleted =
    memberStatus.length > 0 &&
    memberStatus.every((m) => m.status === "Completed");

  return {
    circleId: circle._id,
    circleName: circle.circleName,
    members: memberStatus,
    allCompleted,
  };
}

// ─────────────────────────────────────────────────────────────
// Get the tracking board for the circle the user belongs to.
// Throws if user is not in a circle.
// ────────────────────────────────────────────────────────────

export async function getTrackingBoardForUser(userId) {
  const circle = await circleService.getMyCircle(userId);
  if (!circle) {
    const err = new Error("User is not a member of any circle");
    err.status = 404;
    throw err;
  }

  // circle returned from getMyCircle is lean() already in circleService
  return await buildTrackingBoard(circle);
}

// ─────────────────────────────────────────────────────────────
// Get the tracking board for a specific circle.
// Caller must be a circle member (permission enforced).
// ────────────────────────────────────────────────────────────

export async function getTrackingBoardForCircle(circleId, callerUserId) {
  // This validates membership too
  const circle = await circleService.getCircleForMember(circleId, callerUserId);
  // getCircleForMember returns a populated circle (members populated)
  // But buildTrackingBoard expects a circle with members array of IDs or lean shape.
  // Normalize to a simple object with _id, circleName and members array of ids.
  const memberIds = Array.isArray(circle.members)
    ? circle.members.map((m) => (m._id ? m._id : m))
    : [];
  const simpleCircle = {
    _id: circle._id,
    circleName: circle.circleName,
    members: memberIds,
  };

  return await buildTrackingBoard(simpleCircle);
}

// ─────────────────────────────────────────────────────────────
// old ones
// ────────────────────────────────────────────────────────────

// Returns the circle members' completion status for the Result Screen
export async function getCircleResultForUser(userId) {
  // Get the circle
  const circle = await circleService.getMyCircle(userId);
  if (!circle)
    throw Object.assign(new Error("User is not in a circle"), { status: 404 });

  // Populate members
  const members = await User.find({ _id: { $in: circle.members } })
    .select("displayName avatar dailyScore")
    .lean();

  // Map member to status
  const memberStatus = members.map((m) => {
    const answered = m.dailyScore?.answeredQuestions?.length || 0;
    return {
      _id: m._id,
      displayName: m.displayName,
      avatar: m.avatar,
      status: answered >= 4 ? "Completed" : "Pending",
    };
  });

  // Check if all members have completed
  const allCompleted = memberStatus.every((m) => m.status === "Completed");

  return {
    circleId: circle._id,
    circleName: circle.circleName,
    members: memberStatus,
    allCompleted,
  };
}
