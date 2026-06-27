import { client } from "@repo/redis";
import { getMove } from "@repo/redis";

const getGameById = async (gameId: string) => {
  //redisclient
  return await getMove(client, gameId);
};

export { getGameById };
