import type { NextFunction, Request, Response } from "express";
import { registerUserSchema } from "../validation/user.validator";
import logger from "../logger/logger";
import { registerUserService } from "../services/user.service";
import { createSuccessResponse } from "../utils/response.body";

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

export { registerUserController };
