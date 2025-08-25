import "./config/dbConnection.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.js";
import authRouter from "./routes/authRouter.js";
import dailyScoreRouter from "./routes/dailyScoreRouter.js";
import matchRouter from "./routes/matchRouter.js";
import circleRouter from "./routes/circleRouter.js";

const app = express();
const port = process.env.PORT || 4321;

const origin =
  process.env.NODE_ENV === "production"
    ? "https://moodsyncapi.onrender.com/"
    : "http://localhost:5173";

app.use(cors({ origin: origin, credentials: true }));
app.use(express.json());
app.use(cookieParser()); // above the endpoints

app.use("/auth", authRouter);
app.use("/daily-score", dailyScoreRouter);
app.use("/match", matchRouter);
app.use("/circle", circleRouter);

// errors + splat route must be after all endpoints
app.use("*splat", (req, res) => res.status(404).json({ error: "Not found" })); // wrong or false routes
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);
