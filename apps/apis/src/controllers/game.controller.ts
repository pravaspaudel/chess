import { AppError } from "../errors/errors";
import asyncHandler from "../utils/asyncHandler";
import type { NextFunction, Request, Response } from "express";
import { createSuccessResponse } from "../utils/response.body";
import { getGameByIdService } from "../services/game.service";

const getSingleGameController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gameId } = req.params;

    if (!gameId || Array.isArray(gameId)) {
      throw new AppError(404, "invalid gameId");
    }

    const game = await getGameByIdService(gameId);

    return res.json(
      createSuccessResponse(200, "got game", {
        game,
      }),
    );
  },
);

export { getSingleGameController };
