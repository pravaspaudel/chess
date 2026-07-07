import { Router } from "express";
import {
  getGamesByUserController,
  getSingleGameController,
} from "../controllers/game.controller";

const gameRouter = Router();

gameRouter.get("/games/:gameId", getSingleGameController);

//get games by user's Id
gameRouter.get("/users/:userId/games", getGamesByUserController);

export default gameRouter;
