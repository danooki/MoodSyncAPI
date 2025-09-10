# MoodSync API

**A comprehensive partner alignment API that helps couples understand each other better through daily questions, mood tracking, and compatibility analysis.**

## Project Description

**MoodSync API** - A Node.js/Express backend service that enables couples to track daily moods, answer compatibility questions, and receive relationship insights.

**Tech Stack**: Node.js, Express.js, MongoDB, JWT Authentication, Cloudinary, Zod Validation

**Frontend Integration**: Works with [MoodSync Frontend](https://github.com/danooki/MoodSyncFrontEnd) to provide a complete the platform.

### Core Functionality

- JWT-based authentication and user management
- Daily question system with mood tracking
- Circle-based relationship management with invitations
- Compatibility analysis and proposals
- Real-time notification system

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- Git

### Installation

1. Clone the repository

```bash
git clone https://github.com/danooki/MoodSyncAPI.git
cd MoodSyncAPI
```

2. Install dependencies

```bash
npm install
```

3. Environment Configuration
   Create a `.env` file in the root directory with the following variables:

```bash
#Database
MONGO_URI=the.connection.string.from.mongoDB

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# CORS Configuration for production
SPA_ORIGIN=http://localhost:5173 or https://your-deployed-frontend.com

# Server Configuration
PORT=4321
NODE_ENV=development
```

## Terminal Commands

- `npm run dev`: Starts development server, pulling environment variables from `.env` file.
- `npm start`: Starts production server, pulling environment variables from the system.

# Endpoints

## Authentication

User registration, login, and logout functions with JWT token management.

| Method   | Endpoint        | Description                      |
| -------- | --------------- | -------------------------------- |
| `POST`   | `/auth/signup`  | Register a new user account      |
| `POST`   | `/auth/signin`  | Login user and receive JWT token |
| `DELETE` | `/auth/signout` | Logout user and invalidate token |

**Response:** JWT token returned on successful authentication

## User Management

Retrieve and manage user profile information.

| Method | Endpoint   | Description                           |
| ------ | ---------- | ------------------------------------- |
| `GET`  | `/user/me` | Get complete user profile information |

**Response:** Returns user profile data including preferences, settings, and account details

## Circle Management

Create and manage relationship circles with invitation system. Users must be in a circle to access most features.

| Method | Endpoint                           | Description                      |
| ------ | ---------------------------------- | -------------------------------- |
| `POST` | `/circle`                          | Create a new relationship circle |
| `GET`  | `/circle/my-circle`                | Get the circle you belong to     |
| `POST` | `/circle/:circleId/invite`         | Invite user by displayName       |
| `POST` | `/circle/invite/:inviteId/accept`  | Accept a circle invitation       |
| `POST` | `/circle/invite/:inviteId/decline` | Decline a circle invitation      |
| `GET`  | `/circle/invites`                  | List all pending invitations     |

**Note:** Circle membership is required for accessing daily questions and tracking features

## Notifications

Manage real-time notifications for circle activities and invitations.

| Method | Endpoint                              | Description                   |
| ------ | ------------------------------------- | ----------------------------- |
| `GET`  | `/notifications/unread`               | List all unread notifications |
| `POST` | `/notifications/:notificationId/read` | Mark notification as read     |

**Workflow:** Circle owner creates circle → invites user → user checks invites → accepts/declines → both users receive notifications

## Daily Questions

Interactive daily question system for mood tracking and compatibility analysis.

| Method | Endpoint                     | Description                                     |
| ------ | ---------------------------- | ----------------------------------------------- |
| `GET`  | `/daily-score/next-question` | Get next available question (presents 4 random) |
| `POST` | `/daily-score/answer`        | Submit answer for a specific question           |
| `GET`  | `/daily-score`               | Get current user's daily score                  |

**Request Body Example:**

```json
{
  "questionId": "q1",
  "choiceId": "a"
}
```

**Note:** Questions are presented in sets of 4 random unanswered questions per session

## Tracking Board

Monitor daily question completion status for all circle members.

| Method | Endpoint                    | Description                                               |
| ------ | --------------------------- | --------------------------------------------------------- |
| `GET`  | `/tracking-board`           | Get tracking board for current user's circle (owner case) |
| `GET`  | `/tracking-board/:circleId` | Get tracking board for specific circle (member case)      |

**Response:** Shows all circle members with their daily question status (Pending/Completed)

## Match Analysis

View compatibility analysis and trait matching for circle members.

| Method | Endpoint         | Description                                    |
| ------ | ---------------- | ---------------------------------------------- |
| `GET`  | `/match/preview` | Get overview of circle's compatibility details |

**Response:** Shows each member's current daily primary and secondary traits for compatibility analysis

**Purpose:** Provides insights before generating personalized proposals

## Proposals (Hard Coded)

Generate and retrieve personalized relationship proposals based on compatibility analysis.

| Method | Endpoint          | Description                                   |
| ------ | ----------------- | --------------------------------------------- |
| `GET`  | `/proposal/today` | Get today's personalized proposals for circle |

**Response:** Returns text hard-coded proposals generated from match analysis results

**Workflow:** Match comparisson → Personalized proposals for circle members

# Still in production:

### Proposal from AI

- Gemini AI delivers a proposal based on the Match result.

### Dashboard System

- Allows to see historic values before.

### User Settings

- To change password.
- upload image.
- remove yourself from a circle and others.
- ownership of a circle passes to next user.
