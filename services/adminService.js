import User from "../models/UserModel.js";
import Circle from "../models/CircleModel.js";

// ────────────────────────────────────────────────────────────
// Hidden admin function to find users who don't belong to any circle
// ────────────────────────────────────────────────────────────

export async function getUsersWithoutCircle() {
  try {
    // Get all users
    const allUsers = await User.find({})
      .select("_id displayName email createdAt")
      .lean();

    // Get all users who are members of any circle
    const usersInCircles = await Circle.aggregate([
      {
        $unwind: "$members",
      },
      {
        $group: {
          _id: "$members",
        },
      },
    ]);

    // Extract user IDs from circles
    const userIdsInCircles = usersInCircles.map((item) => item._id.toString());

    // Filter users who are NOT in any circle
    const usersWithoutCircle = allUsers.filter(
      (user) => !userIdsInCircles.includes(user._id.toString())
    );

    return usersWithoutCircle;
  } catch (error) {
    console.error("Error in getUsersWithoutCircle:", error);
    throw new Error("Failed to retrieve users without circles");
  }
}

// ────────────────────────────────────────────────────────────
// Hidden admin function to find circles with invalid/deleted users
// ────────────────────────────────────────────────────────────

export async function getCirclesWithInvalidUsers() {
  try {
    // Get all circles with their members
    const allCircles = await Circle.find({})
      .select("_id circleName owner members createdAt")
      .lean();

    // Get all valid user IDs
    const validUserIds = await User.find({}).select("_id").lean();
    const validUserIdSet = new Set(
      validUserIds.map((user) => user._id.toString())
    );

    // Find circles with invalid users
    const circlesWithInvalidUsers = [];

    for (const circle of allCircles) {
      const invalidMembers = [];
      let hasInvalidOwner = false;

      // Check if owner is valid
      if (!validUserIdSet.has(circle.owner.toString())) {
        hasInvalidOwner = true;
      }

      // Check each member
      for (const memberId of circle.members) {
        if (!validUserIdSet.has(memberId.toString())) {
          invalidMembers.push(memberId.toString());
        }
      }

      // If circle has invalid users, add it to results
      if (hasInvalidOwner || invalidMembers.length > 0) {
        circlesWithInvalidUsers.push({
          _id: circle._id,
          circleName: circle.circleName,
          owner: circle.owner,
          hasInvalidOwner,
          invalidMembers,
          totalMembers: circle.members.length,
          validMembers: circle.members.length - invalidMembers.length,
          createdAt: circle.createdAt,
        });
      }
    }

    return circlesWithInvalidUsers;
  } catch (error) {
    console.error("Error in getCirclesWithInvalidUsers:", error);
    throw new Error("Failed to retrieve circles with invalid users");
  }
}
