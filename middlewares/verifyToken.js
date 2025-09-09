import jwt from "jsonwebtoken"; // need this to verify the token.

const verifyToken = (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // 2. Verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // DEBUG: Log the decoded token
    console.log("DEBUG JWT - decoded:", decoded);
    console.log("DEBUG JWT - decoded.userId:", decoded.userId);
    console.log("DEBUG JWT - decoded.userId type:", typeof decoded.userId);

    // 3. Attach userId to request
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default verifyToken;
