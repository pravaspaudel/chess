import express from "express";
import type { Request, Response } from "express";
import userRouter from "./routes/user.routes";
import errorMiddleware from "./middleware/error.middleware";

const app = express();

//middleware
app.use(express.json());

//routes
app.use("/api/v1/", userRouter);

//error handler
app.use(errorMiddleware);

export default app;
