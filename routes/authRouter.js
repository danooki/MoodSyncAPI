import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/authController.js";
import { signInSchema, signUpSchema } from "../zod/userSchema.js";
import validateZod from "../middlewares/validateZod.js";
import verifyToken from "../middlewares/verifyToken.js";

const authRouter = Router();

authRouter.post("/signin", validateZod(signInSchema), signIn);
authRouter.post("/signup", validateZod(signUpSchema), signUp);
authRouter.delete("/signout", signOut);

export default authRouter;
