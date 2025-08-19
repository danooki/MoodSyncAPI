import jwt from "jsonwebtoken"; // we need this to verify the token.

const verifyToken = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) throw new Error("Unauthorized", { cause: 401 }); // if there is no token, it doesnt allow you to continue (posting or any action)

  const payload = jwt.verify(token, process.env.JWT_SECRET); // compares the token with the JWT secret one.
  console.log(payload);

  req.body.author = payload.id;

  next();
};

export default verifyToken;
