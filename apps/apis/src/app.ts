import express from "express";
import userRouter from "./routes/user.routes";
import errorMiddleware from "./middleware/error.middleware";
import cookieParser from "cookie-parser";

const app = express();

//middleware
app.use(cookieParser());
app.use(express.json());

//routes
app.use("/api/v1/", userRouter);

//error handler
app.use(errorMiddleware);

export default app;
