import { AppError } from "../errors/errors";
import { findGamesByUser, getGameById } from "../repositories/game.repository";

const getGameByIdService = async (gameId: string) => {
  let game = await getGameById(gameId);

  if (!game) {
    throw new Error("no game exists in redis");
  }

  console.log("getgameByIdService : ", game);

  return game;
};

const gamesPlayedByUserService = async (userId: string) => {
  const games = await findGamesByUser(userId);

  if (!games || games.length == 0) {
    throw new AppError(200, "no games played");
  }

  console.log("gamesPlayed by user", games);

  return games;
};

export { getGameByIdService, gamesPlayedByUserService };
