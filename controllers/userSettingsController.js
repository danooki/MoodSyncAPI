import User from "../models/UserModel.js";
import Circle from "../models/CircleModel.js";
import bcrypt from "bcrypt";
import cloudinary from "../utils/cloudinary.js";

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    // Get user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// UPDATE DISPLAY NAME - Update user's display name
const updateDisplayName = async (req, res) => {
  try {
    const { displayName } = req.body;
    const userId = req.userId;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if displayName is already taken by another user
    if (displayName !== user.displayName) {
      const existingUser = await User.findOne({
        displayName,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(400).json({ error: "Display name is already taken" });
      }
    }

    // Update display name
    user.displayName = displayName;
    await user.save();

    res.json({
      message: "Display name updated successfully",
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        avatar: user.avatar,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error in updateDisplayName:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// UPDATE EMAIL - Update user's email address
const updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.userId;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ error: "Email is already taken" });
      }
    }

    // Update email
    user.email = email;
    await user.save();

    res.json({
      message: "Email updated successfully",
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        avatar: user.avatar,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error in updateEmail:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// UPLOAD AVATAR
const uploadAvatar = async (req, res) => {
  try {
    const userId = req.userId;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete old avatar from Cloudinary if it exists
    if (user.avatar && user.avatar.includes("cloudinary")) {
      const publicId = user.avatar.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.warn("Failed to delete old avatar:", cloudinaryError);
      }
    }

    // Upload new image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      width: 300,
      height: 300,
      crop: "fill",
      gravity: "face",
    });

    // Update user avatar
    user.avatar = result.secure_url;
    await user.save();

    res.json({
      message: "Avatar uploaded successfully",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Error in uploadAvatar:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// LEAVE CIRCLE
const leaveCircle = async (req, res) => {
  try {
    const userId = req.userId;

    // Find user's circle
    const circle = await Circle.findOne({ members: userId });
    if (!circle) {
      return res
        .status(400)
        .json({ error: "You are not a member of any circle" });
    }

    // Remove user from circle members
    circle.members = circle.members.filter(
      (member) => member.toString() !== userId.toString()
    );

    // If user is the owner, transfer ownership to next member
    if (circle.owner.toString() === userId.toString()) {
      if (circle.members.length > 0) {
        // Transfer ownership to the first remaining member
        circle.owner = circle.members[0];
      } else {
        // No members left, circle will be deleted
        await Circle.findByIdAndDelete(circle._id);
        return res.json({
          message:
            "You have left the circle. The circle has been deleted as it is now empty.",
        });
      }
    }

    // Save circle (or it gets deleted if empty)
    if (circle.members.length > 0) {
      await circle.save();
      res.json({
        message: "You have successfully left the circle",
        circleName: circle.circleName,
      });
    } else {
      // Circle is now empty, delete it
      await Circle.findByIdAndDelete(circle._id);
      res.json({
        message:
          "You have left the circle. The circle has been deleted as it is now empty.",
      });
    }
  } catch (error) {
    console.error("Error in leaveCircle:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  changePassword,
  updateDisplayName,
  updateEmail,
  uploadAvatar,
  leaveCircle,
};
