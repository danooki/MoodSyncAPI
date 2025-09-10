# MoodSync Partner Alignment Helper

A partner alignment helper API that enables couples to understand each other better through daily questions, mood tracking, and compatibility analysis.
Works together with the Frontend in https://github.com/danooki/MoodSyncFrontEnd

## Setup

- `npm i` to install dependencies.
- Create a `.env` file with variables:
- `MONGO_URI=` for the collection.
- `JWT_SECRET=` for the cookies.
- `SPA_ORIGIN=` for CORS configuration (frontend URL).

### Environment Variables Examples:

```bash
MONGO_URI=the.connection.string.from.mongoDB

JWT_SECRET=your-super-secret-jwt-key-here

#For production deployment
SPA_ORIGIN=https://your-deployed-frontend.com

# Server Configuration
PORT=4321
NODE_ENV=development
```

## Terminal Commands

- `npm run dev`: Starts development server, pulling environment variables from `.env` file.
- `npm start`: Starts production server, pulling environment variables from the system.

# Endpoints

## Authentication

Login / Registration → JWT returned.

```bash
POST /auth/signup for register.
POST /auth/signin to login.
DEL /auth/signout to log out.
```

## User's view:

```bash
GET /user/me view complete information of user.
```

## Circle: create and invite

Circle Check → user must be in a circle.

```bash
POST /circle create your unique circle.
GET /circle/my-circle see the circle you belong to.
POST /circle/:circleId/invite to invite another user by displayName.
POST /circle/invite/:inviteId/accept to accept an invitation.
POST /circle/invite/:inviteId/decline to decline an invitation.
GET /circle/invites list of pending invites.
```

## Notification routes

Owner create a circle → invite another user → check invites → accept/decline → check notifications

```bash
GET /notifications/unread list unread notifications.
POST /notifications/:notificationId/read marks notification as read.
```

## Questions environment

Start Daily Questions → present 4 random unanswered questions.

```bash
GET /daily-score/next-question first or next question trigger point.
POST /daily-score/answer answers a ´questionId´: ´q1´ with a ´choiceId´ : ´a´ or ´b´.
```

## Tracking Board after answering questions

Show all circle members + status (Pending / Completed).

```bash
GET /tracking-board for Tracking Board for the current user´s circle (owner case).
GET /tracking-board/:circleId Tracking board for a specific circle (member case).
```

## Match

```bash
GET /match/preview overview of the circle's details before moving to Proposal.
```

## Score after sign in.

```bash
GET /daily-score see current score of user.
```

## Hard Proposal Screen

- Text of proposals based on the result from Match.

## Secret Admin endpoints

```bash
GET /admin/??? to see users that do not belong to a circle.
```

# Still in production (September 2025):

### Proposal from AI

- Gemini AI delivers a proposal based on the Match result.

### Dashboard System

- Allows to see historic values before.

### User Settings

- To change password.
- upload image.
- remove yourself from a circle and others.
- ownership of a circle passes to next user.
