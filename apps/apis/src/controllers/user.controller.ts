import type { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { AppError } from "../errors/errors";
import { createSuccessResponse } from "../utils/response.body";
import {
  getUserByIdService,
  searchUsernameService,
} from "../services/user.service";

// /users?username=
const getUserByUsernameController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const params = req.query;

    if (!params) {
      throw new AppError(400, "invalid request");
    }

    const username = params.username;

    console.log("username is", username);

    if (!username) {
      throw new AppError(400, "invalid request");
    }

    const users = await searchUsernameService(username as string);

    return res.json(
      createSuccessResponse(200, "got users with searched username", users),
    );
  },
);

//get user by its id
const getUserByUserIdController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    console.log(`user id is ${userId} , type is ${typeof userId}`);

    if (!userId || typeof userId !== "string") {
      throw new AppError(400, "invalid request");
    }

    console.log("userid was ", userId);

    const user = await getUserByIdService(userId);

    return res.json(createSuccessResponse(200, "got user by it's id", user));
  },
);

export { getUserByUsernameController, getUserByUserIdController };
