import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// SIGN IN
const signIn = async (req, res) => {
  const { email, password } = req.body; // Extracts credentials from request

  // 1. Find user
  let user = await User.findOne({ email }).select("+password"); // Finds user in database // updated to let
  if (!user) throw new Error("Invalid Credentials", { cause: 404 });

  // 2. Compare password
  const isMatch = await bcrypt.compare(password, user.password); // will compare the storage password.
  if (!isMatch) throw new Error("Invalid Credentials", { cause: 400 });

  const payload = { id: user._id, firstName: user.firstName }; // Creates JWT with user info (id, name)
  const jwtSecret = process.env.JWT_SECRET;
  const tokenOptions = { expiresIn: "7d" };

  const token = jwt.sign(payload, jwtSecret, tokenOptions);
  console.log(token);

  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true, // JavaScript can't access this cookie
    secure: isProduction ? true : false,
    sameSite: isProduction ? "None" : "Lax", // sameSite can be Strict, Lax, or None.
    // Selecting "None" allows cross-origin requests (for separate frontend/backend domains)
  };

  user = user.toObject(); // converts mongodb object to regular JS object.
  delete user.password; // delete password for the response.

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
    })
    .json(user);
};
// not secure on development mode = because localhost doesnt have https.

// SIGN UP
const signUp = async (req, res) => {
  const { firstName, email, password } = req.body; // FIRST deconstruct the user parameters

  const userExists = await User.findOne({ email }); // check the user doesnt exist or not repeated
  if (userExists) throw new Error("User already exists", { cause: 400 }); // error if user exists.

  // we need to hash the password, and then pass it to the database.
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    firstName,
    email,
    password: hashedPassword,
  }); // use the information from the body to create the user.

  res.json(newUser);
};

// SIGN OUT
const signOut = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? "None" : "Lax", // sameSite can be Strict, Lax, or None.
  };

  res.clearCookie("token", cookieOptions);
  res
    .status(200)
    .json({ message: "You just logged out from MoodSync. Goodbye!" });
};

export { signIn, signUp, signOut };
