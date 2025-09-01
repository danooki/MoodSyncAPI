import { Router } from "express";
import { getMe } from "../controllers/userController.js";
import verifyToken from "../middlewares/verifyToken.js";

const userRouter = Router();

userRouter.get("/me", verifyToken, getMe);

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
