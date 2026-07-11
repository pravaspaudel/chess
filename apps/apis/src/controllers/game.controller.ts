import { AppError } from "../errors/errors";
import asyncHandler from "../utils/asyncHandler";
import type { NextFunction, Request, Response } from "express";
import { createSuccessResponse } from "../utils/response.body";
import {
  gamesPlayedByUserService,
  getGameByIdService,
} from "../services/game.service";
import { findGamesByUser } from "../repositories/game.repository";

const getSingleGameController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gameId } = req.params;

    if (!gameId || Array.isArray(gameId)) {
      throw new AppError(400, "invalid gameId");
    }

    const game = await getGameByIdService(gameId);

    return res.json(
      createSuccessResponse(200, "got game", {
        game,
      }),
    );
  },
);

const getGamesByUserController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (!userId || Array.isArray(userId)) {
      throw new AppError(400, "invalid params [userId]");
    }

    const games = await gamesPlayedByUserService(userId);

    return res.json(
      createSuccessResponse(200, "got all the games", {
        games,
      }),
    );
  },
);

export { getSingleGameController, getGamesByUserController };
