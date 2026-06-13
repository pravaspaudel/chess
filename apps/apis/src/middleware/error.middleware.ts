import type { Request, Response, NextFunction } from "express";
import { success, ZodError } from "zod";
import logger from "../logger/logger";
import { AppError } from "../errors/errors";
import { createErrorResponse } from "../utils/response.body";

const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof AppError) {
    logger.warn(error.message);

    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    const zodErrors: Array<Record<string, string>> = [];

    for (let err of error.issues) {
      //array of objects with field and message
      const field = err.path.join(".");
      const message = err.message;
      zodErrors.push({
        field,
        message,
      });
    }

    return res
      .status(400)
      .json(
        createErrorResponse(
          400,
          "VALIDATION_ERROR",
          "validation failed",
          zodErrors,
        ),
      );
  }

  logger.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorMiddleware;
