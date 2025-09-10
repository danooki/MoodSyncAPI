import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { getMyCircle } from "../services/circleService.js";
import { createSendToken } from "../utils/createSendToken.js";
import { StatusCodes } from "http-status-codes";

// SIGN IN
const signIn = async (req, res) => {
  const { email, password } = req.body; // Extracts credentials from request

  // 1. Find user
  let user = await User.findOne({ email }).select("+password"); // Finds user in database // updated to let
  if (!user) throw new Error("Invalid Credentials", { cause: 404 });

  // 2. Compare password
  const isMatch = await bcrypt.compare(password, user.password); // will compare the storage password.
  if (!isMatch) throw new Error("Invalid Credentials", { cause: 400 });

  user = user.toObject(); // converts mongodb object to regular JS object.
  delete user.password; // delete password for the response.

  // Get user's circle information
  const circle = await getMyCircle(user._id);

  // Restructure user object to match the format returned by /user/me endpoint
  const userResponse = {
    id: user._id,
    displayName: user.displayName,
    email: user.email,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    // Include circle information if user belongs to one
    circle: circle
      ? {
          id: circle._id,
          name: circle.circleName,
          isOwner: circle.owner.toString() === user._id.toString(),
          memberCount: circle.members.length,
          createdAt: circle.createdAt,
        }
      : null,
  };

  createSendToken(userResponse, StatusCodes.OK, res);
};

// SIGN UP
const signUp = async (req, res) => {
  const { displayName, email, password } = req.body; // FIRST deconstruct the user parameters

  const userExists = await User.findOne({ email }); // check the user doesnt exist or not repeated
  if (userExists) throw new Error("User already exists", { cause: 400 }); // error if user exists.

  // we need to hash the password, and then pass it to the database.
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    displayName,
    email,
    password: hashedPassword,
  }); // use the information from the body to create the user.

  // Convert to object and restructure to match the format returned by /user/me endpoint
  const userObject = newUser.toObject();

  // Get user's circle information (new users typically won't have one)
  const circle = await getMyCircle(userObject._id);

  const userResponse = {
    id: userObject._id,
    displayName: userObject.displayName,
    email: userObject.email,
    avatar: userObject.avatar,
    createdAt: userObject.createdAt,
    updatedAt: userObject.updatedAt,
    // Include circle information if user belongs to one
    circle: circle
      ? {
          id: circle._id,
          name: circle.circleName,
          isOwner: circle.owner.toString() === userObject._id.toString(),
          memberCount: circle.members.length,
          createdAt: circle.createdAt,
        }
      : null,
  };

  createSendToken(userResponse, StatusCodes.CREATED, res);
};

// SIGN OUT
const signOut = async (req, res) => {
  // Since we're using localStorage, the frontend will handle token removal
  // Just return success message
  res
    .status(200)
    .json({ message: "You just logged out from MoodSync. Goodbye!" });
};

export { signIn, signUp, signOut };
