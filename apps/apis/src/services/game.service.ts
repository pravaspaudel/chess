import { getGameById } from "../repositories/game.repository";

const getGameByIdService = async (gameId: string) => {
  let game = await getGameById(gameId);

  if (!game) {
    throw new Error("no game exists in redis");
  }

  console.log("getgameByIdService : ", game);

  return game;
};

export { getGameByIdService };
