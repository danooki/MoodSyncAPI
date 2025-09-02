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
