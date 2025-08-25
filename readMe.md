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
```

## Questions after sign in.

```bash
GET /daily-score see current score of user.
POST /daily-score/answer answers a "questionId": "q1" with a "choiceId" : "a".
```

## For testing

```bash
POST /daily-score/answer provides answer "a" or "b"
```

## Compare with Partner

```bash
GET /match/today compares with partner. If no partner = "No partner linked".
```
