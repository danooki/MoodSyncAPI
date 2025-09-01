import { Router } from "express";
import { getMe } from "../controllers/userController.js";
import {
  changePassword,
  updateDisplayName,
  updateEmail,
  uploadAvatar,
  leaveCircle,
} from "../controllers/userSettingsController.js";
import verifyToken from "../middlewares/verifyToken.js";
import validateZod from "../middlewares/validateZod.js";
import {
  uploadAvatar as uploadAvatarMiddleware,
  handleUploadError,
} from "../middlewares/uploadMiddleware.js";
import {
  changePasswordSchema,
  updateDisplayNameSchema,
  updateEmailSchema,
  leaveCircleSchema,
} from "../zod/userSchema.js";

const userRouter = Router();
userRouter.use(verifyToken);

userRouter.get("/me", getMe);

// User settings routes
userRouter.put(
  "/change-password",
  validateZod(changePasswordSchema),
  changePassword
);
userRouter.put(
  "/update-displayname",
  validateZod(updateDisplayNameSchema),
  updateDisplayName
);
userRouter.put("/update-email", validateZod(updateEmailSchema), updateEmail);
userRouter.post(
  "/upload-avatar",
  uploadAvatarMiddleware,
  handleUploadError,
  uploadAvatar
);
userRouter.post("/leave-circle", validateZod(leaveCircleSchema), leaveCircle);

export default userRouter;

/* ===========================

GET /me to Get current user profile information
Request Body: None
Headers: Authorization: Bearer <token>

Response:
- Success (200): 
  {
    "message": "This is all the information about "user.displayName".",
      "user": {
        "_id": "string", (mongoose id of the user, cant change this name)
        "email": "string",
        "displayName": "string",
        "avatar": "string (optional)",
        "createdAt": "date",
        "updatedAt": "date"
      },
      "circle": {
        "_id": "string", (mongoose id of the circle, cant change this name)
        "circleName": "string",
        "isOwner": "boolean",
        "memberCount": "number",
        "createdAt": "date"
      },  
      "dailyQuestions": {
        "summary": "string",
        "currentScore": "object",
      },
  }

- Error (401): 
  {
    "success": false,
    "message": "Unauthorized or invalid token"
  }

- Error (404): 
  {
    "success": false,
    "message": "User not found"
  }
    
*/
