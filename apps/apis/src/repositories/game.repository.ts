import { client } from "@repo/redis";
import { getMoves } from "@repo/redis";
import { getGameByIdService } from "../services/game.service";
import { db } from "@repo/database";
// import { games, moves } from "@repo/database/src/schema/schema";
import { games, moves } from "@repo/database/src/schema/schema";

const getGameById = async (gameId: string) => {
  //redisclient
  return await getMoves(client, gameId);
};

//calling this function when game ends, eithercheckmate,draw
// await saveGame(redisClient, gameId, "w");

export { getGameById };
