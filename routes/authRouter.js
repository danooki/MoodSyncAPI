import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/authController.js";
import { signInSchema, userSchema } from "../zod/userSchema.js";
import validateZod from "../middlewares/validateZod.js";

const authRouter = Router();

authRouter.post("/signin", validateZod(signInSchema), signIn);
authRouter.post("/signup", validateZod(userSchema), signUp);
authRouter.delete("/signout", signOut);

export default authRouter;
