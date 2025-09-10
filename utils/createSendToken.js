import jwt from "jsonwebtoken";

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const createSendToken = function (user, statusCode, res) {
  const token = signToken(user.id);

  // Remove password from user object before sending
  user.password = undefined;

  // Set cookie options for browser compatibility
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true, // JavaScript can't access this cookie
    secure: isProduction ? true : false,
    sameSite: isProduction ? "None" : "Lax", // sameSite can be Strict, Lax, or None.
    // Selecting "None" allows cross-origin requests (for separate frontend/backend domains)
  };

  // Set token as cookie for automatic browser requests
  res.cookie("token", token, cookieOptions);

  // Return token in response body for localStorage storage (Postman/mobile)
  return res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};
