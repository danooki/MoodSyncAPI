import { Router } from "express";
import { getMe } from "../controllers/userController.js";
import verifyToken from "../middlewares/verifyToken.js";

const userRouter = Router();

userRouter.get("/me", verifyToken, getMe);

export default userRouter;
