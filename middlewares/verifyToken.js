import jwt from "jsonwebtoken"; // we need this to verify the token.

const verifyToken = (req, res, next) => {
  try {
    // 1. Get token from cookies
    // cookie parser middleware must be used before this middleware.
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // 2. Verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach userId to request
    req.userId = decoded.id;

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default verifyToken;
