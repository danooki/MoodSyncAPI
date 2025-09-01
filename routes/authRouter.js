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

/* ===========================

POST /signin to Authenticate user and generate access token
Request Body (JSON):
{
  "email": "string (required)",
  "password": "string (required)"
}

Response:
- Success (200): 
  {
      "displayName": "string",
      "email": "string",
      "avatar": "string",
      "currentPartner": "string",
      "preferences": {
        "notifications": {
          "dailyReminder": "boolean",
          "partnerSubmittedAlert": "boolean"
        },
        "timezone": "string"
      }
  }
- Error (400/401): 
  {
    "success": false,
    "message": "Invalid credentials or validation error"
  }

===========================

POST /signup to Register new user account
Request Body (JSON):
{
  "email": "string (required)",
  "password": "string (required, min 6 chars)",
  "displayName": "string (required)"
}

Response:
- Success (201): 
  {
    "displayName": "string",
    "email": "string",
    "avatar": "string",
    "currentPartner": "string",
    "preferences": {
      "notifications": {
        "dailyReminder": "boolean",
        "partnerSubmittedAlert": "boolean"
      },
      "timezone": "string"
    }
  }

- Error (400/409): 
  {
    "success": false,
    "message": "Validation error or email already exists"
  }

  ===========================

DELETE /signout to Logout user and invalidate session
Request Body: None
Headers: Authorization: Bearer <token>
Response:
- Success (200): 
  {
    "message": "You just logged out from MoodSync. Goodbye!"
  }
- Error (401): 
  {
    "success": false,
    "message": "Unauthorized or invalid token"
  }
    
*/
