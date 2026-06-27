import { getGameById } from "../repositories/game.repository";

const getGameByIdService = async (gameId: string) => {
  let game = await getGameById(gameId);

  if (!game) {
    throw new Error("no game exists in redis");
  }

  game = JSON.parse(game);

  if (!game) {
    throw new Error("error in parsing ");
  }

  return game;
};

export { getGameByIdService };
