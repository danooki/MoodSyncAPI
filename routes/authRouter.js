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
    "success": true,
    "message": "Sign in successful",
    "data": {
      "user": {
        "id": "string",
        "email": "string",
        "name": "string"
      },
      "token": "string"
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
  "name": "string (required)"
}

Response:
- Success (201): 
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "string",
        "email": "string",
        "name": "string"
      }
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
    "success": true,
    "message": "Sign out successful"
  }
- Error (401): 
  {
    "success": false,
    "message": "Unauthorized or invalid token"
  }
    
*/
