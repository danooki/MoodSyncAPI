// this file defines endpoints, protect with JWT, validate inputs with Zod

import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import validateZod from "../middlewares/validateZod.js";
import {
  dailyAnswerSchema,
  dailyBatchSchema,
} from "../zod/dailyScoreInputSchema.js";
import {
  getDailyScore,
  postAnswer,
  postBatch,
  getHistory,
  getNextQuestionHandler,
} from "../controllers/dailyScoreController.js";

const router = Router();

// protect all routes here
router.use(verifyToken);

// GET current (auto-resets if > 12h)
router.get("/", getDailyScore);

// GET /next-question to get next unanswered question
router.get("/next-question", getNextQuestionHandler);

// POST /answer to submit one answer
router.post("/answer", validateZod(dailyAnswerSchema), postAnswer);

// POST /batch to submit multiple answers
router.post("/batch", validateZod(dailyBatchSchema), postBatch);

// GET /daily-score/history for daily scores plural
router.get("/history", getHistory);

export default router;

/* ===========================

GET / to Get current daily score (auto-resets if > 12h)
Request Body: None
Headers: Authorization: Bearer <token>

Response:
- Success (200): 
  {
      "dailyScore": {
        "date": "date",
        "D": "number",
        "i": "number",
        "S": "number",
        "C": "number",
        "answeredQuestions": ["string"],
        "dailyDominantTrait": "string",
        "dailySecondaryTrait": "string",
      }
    }
  }

- Error (401): 
  {
    "success": false,
    "message": "Unauthorized or invalid token"
  }

===========================

GET /next-question to Get next question for daily score
Request Body: None
Headers: Authorization: Bearer <token>

Response:
- Success (200): 
  {
    "question": {
      "id": "string",
      "text": "string",
      "type": "string",
      "options": ["array of strings"]
    }
  }

- Error (401): 
  {
    "success": false,
    "message": "Unauthorized or invalid token"
  }

- Error (401): 
  {
    "success": false,
    "message": "Unauthorized or invalid token"
  }

===========================

POST /answer to Submit one answer for daily score
Request Body (JSON):
{
  "questionId": "string (required)",
  "answer": "string (required)"
}
Headers: Authorization: Bearer <token>

Response:
- Success (200): 
  {
    "success": true,
    "message": "Answer submitted successfully",
    "data": {
      "answer": {
        "id": "string",
        "questionId": "string",
        "answer": "string",
        "score": "number",
        "createdAt": "date"
      }
    }
  }

- Error (400): 
  {
    "success": false,
    "message": "Validation error"
  }

- Error (401): 
  {
    "success": false,
    "message": "Unauthorized or invalid token"
  }

===========================

POST /batch to Submit multiple answers for daily score
Request Body (JSON):
{
  "answers": [
    {
      "questionId": "string (required)",
      "choiceId": "string (required)"
    }
  ]
}
Headers: Authorization: Bearer <token>

Response:
- Success (200): 
  {
    "dailyScore": {
      "answers": [
        {
          "id": "string",
          "questionId": "string",
          "answer": "string",
          "score": "number",
          "createdAt": "date"
        }
      ],
      "totalScore": "number"
    }
  }

- Error (400): 
  {
    "success": false,
    "message": "Validation error"
  }

- Error (401): 
  {
    "success": false,
    "message": "Unauthorized or invalid token"
  }

===========================

GET /history to Get daily score history
Request Body: None
Headers: Authorization: Bearer <token>

Response:
- Success (200): 
  {
    "history": [
        {
          "date": "date",
          "D": "number",
          "i": "number",
          "S": "number",
          "C": "number",
          "answeredQuestions": ["string"],
          "dailyDominantTrait": "string",
          "dailySecondaryTrait": "string",
        }
      ]
    }
  }

- Error (401): 
  {
    "success": false,
    "message": "Unauthorized or invalid token"
  }
    
*/
