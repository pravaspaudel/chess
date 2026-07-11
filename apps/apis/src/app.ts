import express from "express";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import errorMiddleware from "./middleware/error.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./config/env.config";
import gameRouter from "./routes/game.route";
import requestLogger from "./logger/request.logger";
import friendRouter from "./routes/friends.route";

const app = express();

app.use(requestLogger);

//middleware
app.use(
  cors({
    origin: config.CORS_URL,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

//routes
app.use("/api/v1/", authRouter);
app.use("/api/v1/", userRouter);
app.use("/api/v1/", gameRouter);
app.use("/api/v1/", friendRouter);

//error handler
app.use(errorMiddleware);

export default app;
