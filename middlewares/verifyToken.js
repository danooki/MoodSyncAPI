import jwt from "jsonwebtoken"; // need this to verify the token.

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

    // DEBUG: Log the decoded token
    console.log("DEBUG JWT - decoded:", decoded);
    console.log("DEBUG JWT - decoded.id:", decoded.id);
    console.log("DEBUG JWT - decoded.id type:", typeof decoded.id);

    // 3. Attach userId to request
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default verifyToken;
