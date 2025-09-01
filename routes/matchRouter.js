import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { getMatchPreview } from "../controllers/matchController.js";

const router = express.Router();

router.use(verifyToken);

// GET /match/preview
router.get("/preview", getMatchPreview);

export default router;

/* ===========================

GET /preview to Get match preview for the current user
Request Body: None
Headers: Authorization: Bearer <token>

Response:
- Success (200): 
{
  "allCompleted": "boolean",
  "circleMembers": [
    {
      "id": "string",
      "displayName": "string",
      "avatar": "string",
      "dominant": "string"
    }
  ]
  "isSinglePersonCircle": "boolean",
}

- Error (401): 
  {
    "success": false,
    "message": "Unauthorized or invalid token"
  }

- Error (404): 
  {
    "success": false,
    "message": "No potential matches found"
  }

- Error (500): 
  {
    "success": false,
    "message": "Failed to retrieve match preview"
  }
    
*/
