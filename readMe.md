# MoodSync Partner Alignment Helper

## Setup

- `npm i` to install dependencies.
- create a `.env` file with variables:
- MONGO_URI= for the collection.
- JWT_SECRET= for the cookies.

## Terminal Commands

- `npm run dev`: Starts development server, pulling environment variables from `.env` file.
- `npm start`: Starts production server, pulling environment variables from the system.

# Endpoints

## Users

Login / Registration → JWT returned.

```bash
POST /signup for register.
POST /signin to login.
DEL /signout to log out.
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
POST /daily-score/answer answers a "questionId": "q1" with a "choiceId" : "a" or "b".
```

## Tracking Board after answering questions

Show all circle members + status (Pending / Completed).

```bash
GET /tracking-board for Tracking Board for the current user's circle (owner case).
GET /tracking-board/:circleId Tracking board for a specific circle (member case).
```

### Still in production:

## Score after sign in.

```bash
GET /daily-score see current score of user.
```

## Match Screen

Shows each partner values to understand each user.

## Proposal Hardcoded

System delivers a proposal based on the Match result
