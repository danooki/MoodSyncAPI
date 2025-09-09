import jwt from "jsonwebtoken";

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const createSendToken = function (user, statusCode, res) {
  const token = signToken(user.id);

  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax", // Changed from "none" to "lax" for better mobile compatibility
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  user.password = undefined;
  return res.status(statusCode).json({ status: "success", token, user });
};
