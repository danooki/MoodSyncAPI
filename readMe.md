# MoodSync Partner Alignment Helper

## Setup

- `npm i` to install dependencies.
- create a `.env` file with variables:
- MONGO_URI= for the collection.
- JWT_SECRET= for the cookies.

## Terminal Commands

- `npm run dev`: Starts development server, pulling environment variables from `.env` file.
- `npm start`: Starts production server, pulling environment variables from the system.

# Endpoints for Postman

## Users

```bash
POST /signup for register.
POST /signin to login.
DEL /signout to log out.
```

## Circle: create and invite

```bash
POST /circle create your unique circle.
GET /circle/my-circle see the circle you belong to.
POST /circle/:circleId/invite to invite another user by displayName.
POST /circle/invite/:inviteId/accept to accept an invitation.
POST /circle/invite/:inviteId/decline to decline an invitation.
GET /circle/invites list of pending invites.
```

## Notification routes

```bash
GET /notifications/unread list unread notifications.
POST /notifications/:notificationId/read marks notification as read.
```

## Testing invitations order

```bash
Order:
Create a circle → invite another user → check invites → accept/decline → check notifications

Error cases:
Invite a user who already has a circle → should return 400
Accept someone else’s invite → should return 403

Check MongoDB:
Verify circles, circleinvites, and notifications collections are updated correctly

JWT:
Make sure the verifyToken middleware is applied to all protected routes
```

## Questions after sign in.

```bash
GET /daily-score see current score of user.
POST /daily-score/answer answers a "questionId": "q1" with a "choiceId" : "a" or "b".
```

## Compare with Partner

```bash
GET /match/today compares with partner. If no partner = "No partner linked".
```
