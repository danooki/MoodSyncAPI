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
    "circle": {
      "id": "string",
      "name": "string",
      "members": ["string", "string"],
      "owner": "string"
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
  
  GET /circle/my-circle to Get the circle the user belongs to
  Request Body: None
  Headers: Authorization: Bearer <token>

  Response:
  - Success (200):
  {
    "isInCircle": "boolean",
    "circleId": "string",
    "circleName": "string"
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

  POST /circle/:circleId/invite to Invite a user to a circle
  The circleId must be in the url.
  Request Body:
  {
    "displayName": "string"
  }
  Headers: Authorization: Bearer <token>

  Response:
  - Success (201):
  {
  "circle": "string", (mongoose id of the circle, cant change this name)
  "fromUser": "string", (mongoose id of the user who is inviting)
  "toUser": "string", (mongoose id of the user who receives the invite)
  "status": "string (pending, accepted, declined)",
  "_id": "string" (mongoose id of the invite, cant change this name)
  "createdAt": "date",
  "updatedAt": "date"
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
- Error (403):
  {
    "success": false,
    "message": "User already in circle or already invited"
  }

  ===========================
  
  POST /circle/invite/:inviteId/accept to Accept an invitation
  The inviteId (invite._id) must be in the url.
  Request Body: None
  Headers: Authorization: Bearer <token>
  
  
  Response:
  - Success (200):
  {
    "circleId": "string"
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

  POST /circle/invite/:inviteId/decline to Decline an invitation
  The inviteId must be in the url.
  Request Body: None
  Headers: Authorization: Bearer <token>

  Response:
  - Success (200):
  {
      "ok": true
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
