import { Router } from "express";
import protectedRoute from "../middleware/protected.middleware";
import {
  getUserByUserIdController,
  getUserByUsernameController,
} from "../controllers/user.controller";

const userRouter = Router();

// /users?username=
userRouter.get("/users", protectedRoute, getUserByUsernameController);

userRouter.get("/users/:userId", protectedRoute, getUserByUserIdController);

export default userRouter;
