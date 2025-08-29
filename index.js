import dotenv from "dotenv";
dotenv.config();

import "./config/dbConnection.js";
import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.js";

import authRouter from "./routes/authRouter.js";
import circleRouter from "./routes/circleRouter.js";
import dailyScoreRouter from "./routes/dailyScoreRouter.js";
import trackingBoardRouter from "./routes/trackingBoardRouter.js";
import getMatchPreview from "./routes/matchRouter.js";
import hardProposalRouter from "./routes/hardProposalRouter.js";

const app = express();
const allowedOrigins = process.env.FRONTEND_URLS?.split(",") || [];
const port = process.env.PORT || 4321;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked CORS request from:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    //     credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser()); // above the endpoints

app.use("/auth", authRouter);
app.use("/circle", circleRouter);
app.use("/daily-score", dailyScoreRouter);
app.use("/tracking-board", trackingBoardRouter);
app.use("/match", getMatchPreview);
app.use("/proposal", hardProposalRouter);

// errors + splat route must be after all endpoints
app.use("*splat", (req, res) => res.status(404).json({ error: "Not found" })); // wrong or false routes
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);
