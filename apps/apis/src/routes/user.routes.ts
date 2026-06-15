import { Router } from "express";
import {
  loginUserController,
  meController,
  registerUserController,
} from "../controllers/user.controller";
import asyncHandler from "../utils/asyncHandler";
import protectedRoute from "../middleware/protected.middleware";

const router = Router();

router.get("/register", asyncHandler(registerUserController));
router.get("/login", asyncHandler(loginUserController));
router.get("/me", protectedRoute, asyncHandler(meController));

export default router;
