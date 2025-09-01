import { Router } from "express";
import {
  getMyTrackingBoard,
  getCircleTrackingBoard,
} from "../controllers/trackingBoardController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

// Protect all routes
router.use(verifyToken);

// GET /tracking-board for Tracking Board for the current user's circle (owner case)
router.get("/", getMyTrackingBoard);

// GET /tracking-board/:circleId Tracking board for a specific circle (member case)
router.get("/:circleId", getCircleTrackingBoard);

export default router;

/* ===========================

GET / to Get current user's circle tracking board (owner case)
Request Body: None
Headers: Authorization: Bearer <token>

Response:
- Success (200): 
  {
    "trackingBoard": {
        "circleId": "string",
        "circleName": "string",
        "members": [
          {
            "_id": "string",
            "displayName": "string",
            "avatar": "string (optional)",
            "answeredCount": "number",
            "status": "string",
          }
        ],
        "allCompleted": "boolean"
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
    "message": "No circle found for current user"
  }

===========================

GET /:circleId to Get tracking board for a specific circle (member case)
Request Body: None
Headers: Authorization: Bearer <token>
Parameters: circleId (string, required)

Response:
- Success (200): 
  {
        "circleId": "string",
        "circleName": "string",
        "members": [
          {
            "userId": "string",
            "name": "string",
            "profilePicture": "string (optional)",
            "dailyScores": [
              {
                "date": "date",
                "score": "number",
                "mood": "string"
              }
            ]
          }
        ],
        "totalMembers": "number",
        "averageScore": "number"
      }
    }
  }

- Error (401): 
  {
    "success": false,
    "message": "Unauthorized or invalid token"
  }

- Error (403): 
  {
    "success": false,
    "message": "User is not a member of this circle"
  }

- Error (404): 
  {
    "success": false,
    "message": "Circle not found"
  }
    
*/
