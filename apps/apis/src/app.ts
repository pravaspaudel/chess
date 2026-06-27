import express from "express";
import userRouter from "./routes/user.routes";
import errorMiddleware from "./middleware/error.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./config/env.config";
import gameRouter from "./routes/game.route";
import requestLogger from "./logger/request.logger";

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
app.use("/api/v1/", userRouter);
app.use("/api/v1/", gameRouter);

//error handler
app.use(errorMiddleware);

export default app;
