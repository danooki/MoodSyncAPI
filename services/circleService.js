// business logic for creating circles, inviting members,
// handling invitations, and notifications.

import Circle from "../models/CircleModel.js";
import CircleInvite from "../models/CircleInviteModel.js";
import Notification from "../models/NotificationModel.js";
import User from "../models/UserModel.js";
import mongoose from "mongoose";

// Creates a new circle with the given user as a member.
export async function createCircle(creatorId, circleName) {
  return await Circle.create({
    circleName,
    members: [creatorId],
  });
}

// checks if a circle exists and if the user is a member.
async function assertMember(circleId, userId) {
  const circle = await Circle.findById(circleId);
  if (!circle) {
    const err = new Error("Circle not found");
    err.status = 404;
    throw err;
  }

  // Check if user is a member of the circle
  if (!circle.members.some((m) => m.toString() === userId.toString())) {
    const err = new Error("Only circle members can perform this action");
    err.status = 403;
    throw err;
  }
  return circle;
}

// sends an invitation to another user (found by displayName) to join the circle.
export async function inviteByDisplayName(circleId, fromUserId, displayName) {
  // The acting user must be a circle member
  const circle = await assertMember(circleId, fromUserId);

  // Find the user to invite
  const toUser = await User.findOne({ displayName });
  if (!toUser) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  // Prevent inviting a user who already belongs to a circle
  const alreadyInCircle = await Circle.findOne({ members: toUser._id });
  if (alreadyInCircle) {
    const err = new Error("User already belongs to another circle");
    err.status = 400;
    throw err;
  }

  // Prevent duplicate pending invitations
  const alreadyPending = await CircleInvite.findOne({
    circle: circle._id,
    toUser: toUser._id,
    status: "pending",
  });
  if (alreadyPending) {
    const err = new Error("There is already a pending invite for this user");
    err.status = 400;
    throw err;
  }

  // Create the invitation
  const invite = await CircleInvite.create({
    circle: circle._id,
    fromUser: fromUserId,
    toUser: toUser._id,
  });

  // Create a notification for the invited user
  await Notification.create({
    user: toUser._id,
    type: "CIRCLE_INVITE",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days for invites
    data: {
      inviteId: invite._id,
      circleId: circle._id,
      message: `You were invited to join ${circle.circleName}`,
    },
  });

  return invite;
}

// Accepts an invitation and adds the user to the circle.
// Rejects if the user already belongs to another circle.
export async function acceptInvite(inviteId, actingUserId) {
  const invite = await CircleInvite.findById(inviteId).populate("circle");
  if (!invite) {
    const err = new Error("Invite not found");
    err.status = 404;
    throw err;
  }
  if (!invite.toUser.equals(actingUserId)) {
    const err = new Error("Not your invitation");
    err.status = 403;
    throw err;
  }
  if (invite.status !== "pending") {
    const err = new Error("Invite is not pending");
    err.status = 400;
    throw err;
  }

  // makes sure the invited user is not already in another circle
  const alreadyInCircle = await Circle.findOne({ members: actingUserId });
  if (alreadyInCircle) {
    const err = new Error("User already belongs to another circle");
    err.status = 400;
    throw err;
  }

  // Add user to circle members
  await Circle.updateOne(
    { _id: invite.circle._id },
    { $addToSet: { members: actingUserId } }
  );

  invite.status = "accepted";
  await invite.save();

  return { circleId: invite.circle._id };
}

// Declines an invitation without joining the circle.
export async function declineInvite(inviteId, actingUserId) {
  const invite = await CircleInvite.findById(inviteId);
  if (!invite) {
    const err = new Error("Invite not found");
    err.status = 404;
    throw err;
  }
  if (!invite.toUser.equals(actingUserId)) {
    const err = new Error("Not your invitation");
    err.status = 403;
    throw err;
  }
  if (invite.status !== "pending") {
    const err = new Error("Invite is not pending");
    err.status = 400;
    throw err;
  }

  invite.status = "declined";
  await invite.save();

  return { ok: true };
}

// Lists the circle where the user is a member (at least one).
export async function getMyCircle(userId) {
  console.log("DEBUG getMyCircle - userId:", userId);
  console.log("DEBUG getMyCircle - userId type:", typeof userId);

  // Try different query approaches with population
  const circle = await Circle.findOne({ members: userId })
    .populate("members", "displayName avatar dailyScore")
    .lean();
  console.log("DEBUG getMyCircle - circle found:", circle);

  if (!circle) {
    // Try alternative query with string conversion
    const circleAlt = await Circle.findOne({
      members: userId.toString(),
    })
      .populate("members", "displayName avatar dailyScore")
      .lean();
    console.log("DEBUG getMyCircle - alternative query result:", circleAlt);

    // Check if there are any circles at all
    const allCircles = await Circle.find({}).lean();
    console.log("DEBUG getMyCircle - all circles:", allCircles);

    // Check if the user is in any circle with different query
    const userInCircle = await Circle.findOne({
      $or: [{ members: userId }, { members: userId.toString() }],
    })
      .populate("members", "displayName avatar dailyScore")
      .lean();
    console.log("DEBUG getMyCircle - userInCircle result:", userInCircle);

    // If we found a circle with alternative query, return it
    if (userInCircle) {
      console.log("DEBUG getMyCircle - returning userInCircle:", userInCircle);
      return userInCircle;
    }
  }

  return circle;
}

// Returns the circleId if the user is in a circle, otherwise null (for Frontend)
export async function isUserInCircle(userId) {
  const circle = await Circle.findOne({ members: userId }).select("_id").lean();
  return circle ? circle._id : null;
}

// Retrieves details of a circle, but only if the user is a member.
export async function getCircleForMember(circleId, userId) {
  const circle = await Circle.findById(circleId).populate(
    "members",
    "displayName avatar"
  );
  if (!circle) {
    const err = new Error("Circle not found");
    err.status = 404;
    throw err;
  }
  if (!circle.members.some((m) => m._id.equals(userId))) {
    const err = new Error("Not a member of this circle");
    err.status = 403;
    throw err;
  }
  return circle;
}
