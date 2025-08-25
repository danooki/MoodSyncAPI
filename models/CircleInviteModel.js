import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const CircleInviteSchema = new Schema(
  {
    circle: {
      type: Types.ObjectId,
      ref: "Circle",
      required: true,
      index: true,
    },
    fromUser: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "revoked"],
      default: "pending",
      index: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Prevent multiple pending invites for the same user in the same circle
CircleInviteSchema.index({ circle: 1, toUser: 1, status: 1 });

// Prevent inviting a user who already belongs to a circle
CircleInviteSchema.pre("validate", async function (next) {
  if (!this.isNew || this.status !== "pending") {
    return next();
  }

  const Circle = mongoose.model("Circle");

  const existingCircle = await Circle.findOne({
    members: this.toUser,
  });

  if (existingCircle) {
    const err = new Error(
      "This user already belongs to a circle and cannot be invited."
    );
    err.status = 400;
    return next(err);
  }

  next();
});

const CircleInvite = mongoose.model("CircleInvite", CircleInviteSchema);
export default CircleInvite;
