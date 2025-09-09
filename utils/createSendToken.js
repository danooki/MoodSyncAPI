import jwt from "jsonwebtoken";

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const createSendToken = function (user, statusCode, res) {
  const token = signToken(user.id);

  // Remove password from user object before sending
  user.password = undefined;

  // Return token in response body for localStorage storage
  return res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};
