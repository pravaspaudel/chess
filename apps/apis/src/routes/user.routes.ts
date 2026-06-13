import { Router } from "express";
import { registerUserController } from "../controllers/user.controller";
import asyncHandler from "../utils/asyncHandler";

const router = Router();

router.get("/register", asyncHandler(registerUserController));

export default router;
