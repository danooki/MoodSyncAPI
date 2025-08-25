import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const CircleSchema = new Schema(
  {
    circleName: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // removed "unique: true" from Model because creates an issue.
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],
  },
  { timestamps: true }
);

// Ensure owner is always in members
CircleSchema.pre("save", function (next) {
  if (this.owner && !this.members.some((m) => m.equals(this.owner))) {
    this.members.push(this.owner);
  }
  next();
});

// Prevent users from belonging to multiple circles
CircleSchema.pre("save", async function (next) {
  if (this.members && this.members.length > 0) {
    for (const memberId of this.members) {
      const existingCircle = await mongoose.models.Circle.findOne({
        _id: { $ne: this._id },
        members: memberId,
      });
      if (existingCircle) {
        const err = new Error("A user can only belong to one circle");
        err.status = 400;
        return next(err);
      }
    }
  }
  next();
});

const Circle = mongoose.model("Circle", CircleSchema);
export default Circle;
