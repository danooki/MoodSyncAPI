import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { getTodayHardProposals } from "../controllers/hardProposalController.js";

const router = Router();

router.use(verifyToken);

router.get("/today", getTodayHardProposals);

export default router;

/* ===========================

GET /today to Get today's hard proposals for the current user
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
],
"proposals": [
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "isCompleted": "boolean"
  }
]
"pairInsights": [
  {
    "members": ["string", "string"],
    "dominantTraits": ["string", "string"],
    "aligned": "boolean",
    "suggestions": ["string", "string"]
  }
]
"circleInfo": {
  "id": "string",
  "name": "string",
  "memberCount": "number"
}

- Error (401): 
  {
    "success": false,
    "message": "Unauthorized or invalid token"
  }

- Error (500): 
  {
    "success": false,
    "message": "Failed to retrieve today's hard proposals"
  }
    

*/
