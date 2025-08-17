import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    avatar: {
      type: String,
      default: "",
    },

    // Partnership for MVP (one partner)
    currentPartner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    preferences: {
      notifications: {
        dailyReminder: { type: Boolean, default: true },
        partnerSubmittedAlert: { type: Boolean, default: true },
      },
      timezone: {
        type: String,
        default: "UTC",
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Returns user object without sensitive info
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = model("User", userSchema);
export default User;
