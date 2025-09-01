import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  createCircleController,
  getMyCircleController,
  inviteController,
  acceptInviteController,
  declineInviteController,
  listInvitesController,
} from "../controllers/circleController.js";

const router = Router();

// Protect all routes
router.use(verifyToken);

router.post("/", createCircleController);
router.get("/my-circle", getMyCircleController);
router.post("/:circleId/invite", inviteController);
router.post("/invite/:inviteId/accept", acceptInviteController);
router.post("/invite/:inviteId/decline", declineInviteController);
router.get("/invites", listInvitesController);

export default router;

/* ===========================

POST /circle to Create a new circle
Request Body:
{
  "circleName": "string"
}
Headers: Authorization: Bearer <token>

Response:
- Success (201): 
  {
    "success": true,
    "message": "Circle created successfully",
    "data": {
      "circle": {
        "id": "string",
        "name": "string",
        "members": ["string", "string"],
        "owner": "string"
      }
    }
  }
- Error (400): 
  {
    "success": false,
    "message": "Validation error or circle name already exists"
  }
- Error (500): 
  {
    "success": false,
    "message": "Failed to create circle"
  }
  
  ===========================
  
  GET /my-circle to Get the circle the user belongs to
  Request Body: None
  Headers: Authorization: Bearer <token>

  Response:
  - Success (200):
  {
    "success": true,
    "message": "Circle retrieved successfully",
    "data": {
      "circle": {
        "id": "string",
        "name": "string",
        "members": ["string", "string"],
        "owner": "string"
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
    "message": "Circle not found"
  }

  ===========================

  POST /:circleId/invite to Invite a user to a circle
  Request Body:
  {
    "displayName": "string"
  }
  Headers: Authorization: Bearer <token>
  Parameters: circleId (string, required)

  Response:
  - Success (201):
  {
    "success": true,
    "message": "Invitation sent successfully",
    "data": {
      "invite": {
        "id": "string",
        "circleId": "string",
        "senderId": "string", 
        "senderName": "string",
        "senderAvatar": "string",
        "status": "string (pending, accepted, declined)"
      }
    }
  }
- Error (400):
  {
    "success": false,
    "message": "Validation error or user not found"
  }
- Error (401):
  {
    "success": false,
    "message": "Unauthorized or invalid token"
  }
- Error (404):
  {
    "success": false,
    "message": "Circle not found"
  }

  ===========================
  
  POST /invite/:inviteId/accept to Accept an invitation
  Request Body: None
  Headers: Authorization: Bearer <token>
  Parameters: inviteId (string, required)
  
  
  Response:
  - Success (200):
  {
    "success": true,
    "message": "Invitation accepted successfully"
  }
- Error (400):
  {
    "success": false,
    "message": "Validation error or invite not found"
  }
- Error (401):
  {
    "success": false,
    "message": "Unauthorized or invalid token"
  }
- Error (403):
  {
    "success": false,
    "message": "Not your invitation"
  }
- Error (404):
  {
    "success": false,
    "message": "Invite not found"
  }

  ===========================

  POST /invite/:inviteId/decline to Decline an invitation
  Request Body: None
  Headers: Authorization: Bearer <token>
  Parameters: inviteId (string, required)

  Response:
  - Success (200):
  {
    "success": true,
    "message": "Invitation declined successfully"
  }
- Error (400):
  {
    "success": false,
    "message": "Validation error or invite not found"
  }
- Error (401):
  {
    "success": false,
    "message": "Unauthorized or invalid token"
  }
- Error (403):
  {
    "success": false,
    "message": "Not your invitation"
  }
- Error (404):
  {
    "success": false,
    "message": "Invite not found"
  }

  ===========================
  
*/
