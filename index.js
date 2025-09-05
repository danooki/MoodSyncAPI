import "./config/dbConnection.js";
import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.js";

// Import models to register them with Mongoose
import "./models/UserModel.js";
import "./models/CircleModel.js";
import "./models/CircleInviteModel.js";
import "./models/NotificationModel.js";

import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import circleRouter from "./routes/circleRouter.js";
import dailyScoreRouter from "./routes/dailyScoreRouter.js";
import trackingBoardRouter from "./routes/trackingBoardRouter.js";
import getMatchPreview from "./routes/matchRouter.js";
import hardProposalRouter from "./routes/hardProposalRouter.js";
import adminRouter from "./routes/adminRouter.js";

const app = express();
const port = process.env.PORT || 4321;

const allowedOrigins = process.env.SPA_ORIGIN.split(",");

// cors to allow requests from both localhost and the deployed app
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser()); // above the endpoints

// Routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/circle", circleRouter);
app.use("/daily-score", dailyScoreRouter);
app.use("/tracking-board", trackingBoardRouter);
app.use("/match", getMatchPreview);
app.use("/hard-proposals", hardProposalRouter);
app.use(process.env.HIDDEN_ADMIN_ENDPOINT, adminRouter);

// Error handling and 404 route (after all endpoints)
app.use("*splat", (req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);

// Start server
app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);
