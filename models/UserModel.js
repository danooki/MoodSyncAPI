import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Schema for dailyScore subdocument
const dailyScoreSchema = new Schema(
  {
    date: { type: Date, required: true }, // use Date for easier comparisons
    D: { type: Number, default: 0 },
    i: { type: Number, default: 0 },
    S: { type: Number, default: 0 },
    C: { type: Number, default: 0 },
    answeredQuestions: [{ type: String }], // store questionIds to avoid double-counting
  },
  { _id: false } // optional: don't need separate _id for embedded doc
);

const userSchema = new Schema(
  {
    displayName: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can contain letters, numbers, and underscore only",
      ],
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

    // Today's score (single embedded doc)
    dailyScore: {
      type: dailyScoreSchema,
      default: () => ({
        date: new Date(),
        D: 0,
        i: 0,
        S: 0,
        C: 0,
        answeredQuestions: [],
      }),
    },

    // optional history of past daily scores
    scoreHistory: {
      type: [dailyScoreSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Returns user object without sensitive info
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject(); // This converts the mongoose document to plain JavaScript object.
  delete userObject.password; // remove password
  return userObject; // return the modified object
};

const User = model("User", userSchema);
export default User;
