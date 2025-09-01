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
    "success": true,
    "message": "User profile retrieved successfully",
    "data": {
      "user": {
        "id": "string",
        "email": "string",
        "name": "string",
        "profilePicture": "string (optional)",
        "createdAt": "date",
        "updatedAt": "date"
      }
    }
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
