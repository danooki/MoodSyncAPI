import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/authController.js";
import { signInSchema, signUpSchema } from "../zod/userSchema.js";
import validateZod from "../middlewares/validateZod.js";
import verifyToken from "../middlewares/verifyToken.js";

const authRouter = Router();

authRouter.post("/signin", validateZod(signInSchema), signIn);
authRouter.post("/signup", validateZod(signUpSchema), signUp);
authRouter.delete("/signout", signOut);
authRouter.get("/me", verifyToken, (req, res) => {
  res.json({ message: "Welcome!", user: req.user });
});

export default authRouter;
