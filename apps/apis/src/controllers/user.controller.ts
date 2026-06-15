import type { NextFunction, Request, Response } from "express";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validation/user.validator";
import logger from "../logger/logger";
import {
  loginUserService,
  registerUserService,
} from "../services/user.service";
import { createSuccessResponse } from "../utils/response.body";
import { AppError, UnauthorizedError } from "../errors/errors";
import { findUserByEmail } from "../repositories/user.repository";
import { comparePassword } from "../utils/password";
import { createCookie, generateToken } from "../utils/cookie";

const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const parsed = registerUserSchema.parse(req.body);

  const registered = await registerUserService(parsed);

  return res
    .status(201)
    .json(createSuccessResponse(201, "user created successfully", registered));
};

const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const parsed = loginUserSchema.parse(req.body);

  const user = await loginUserService(parsed);

  //create token and set cookie
  const token = generateToken({ id: user.id });
  createCookie(res, "token", token);

  return res.status(201).json(
    createSuccessResponse(201, "user logged in successfully", {
      id: user.id,
      username: user.username,
      email: user.email,
    }),
  );
};

const meController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;

  if (!user) {
    throw new UnauthorizedError("you are unauthorized");
  }
  return res.status(200).json(
    createSuccessResponse(200, "you are authorized", {
      user_id: user.id,
    }),
  );
};

export { registerUserController, loginUserController, meController };
