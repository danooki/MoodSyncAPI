import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  listUnreadNotificationsController,
  markNotificationReadController,
} from "../controllers/notificationController.js";

const router = Router();

// Protect all routes
router.use(verifyToken);

// GET /notifications/unread → list all unread notifications for the user
router.get("/unread", listUnreadNotificationsController);

// POST /notifications/:notificationId/read → mark as read
router.post("/:notificationId/read", markNotificationReadController);

export default router;

/* ===========================

GET /unread to List all unread notifications for the current user
Request Body: None
Headers: Authorization: Bearer <token>

Response:
- Success (200): 
  {
    "success": true,
    "message": "Unread notifications retrieved successfully",
    "data": {
      "notifications": [
        {
          "id": "string",
          "type": "string (circle_invite, daily_score, match_proposal, etc.)",
          "title": "string",
          "message": "string",
          "isRead": "boolean",
          "createdAt": "date",
          "metadata": {
            "circleId": "string (optional)",
            "userId": "string (optional)",
            "proposalId": "string (optional)"
          }
        }
      ],
      "totalCount": "number"
    }
  }

- Error (401): 
  {
    "success": false,
    "message": "Unauthorized or invalid token"
  }

- Error (500): 
  {
    "success": false,
    "message": "Failed to retrieve notifications"
  }

===========================

POST /:notificationId/read to Mark a specific notification as read
Request Body: None
Headers: Authorization: Bearer <token>
Parameters: notificationId (string, required)

Response:
- Success (200): 
  {
    "success": true,
    "message": "Notification marked as read successfully",
    "data": {
      "notification": {
        "id": "string",
        "type": "string",
        "title": "string",
        "message": "string",
        "isRead": "boolean (true)",
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
    "success": false",
    "message": "Notification not found"
  }

- Error (403): 
  {
    "success": false",
    "message": "Notification does not belong to current user"
  }
    
*/
