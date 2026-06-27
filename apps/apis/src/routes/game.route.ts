import { Router } from "express";
import { getSingleGameController } from "../controllers/game.controller";

const gameRouter = Router();

gameRouter.get("/game/:gameId", getSingleGameController);

export default gameRouter;
