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

## Questions after sign in.

```bash
GET /daily-score see current score of user.
POST /daily-score/answer answers a "questionId": "q1" with a "choiceId" : "a".
```
