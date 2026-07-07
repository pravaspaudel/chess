import { client } from "@repo/redis";
import { getMoves } from "@repo/redis";
import { getGameByIdService } from "../services/game.service";
import { db, or, eq, alias } from "@repo/database";
// import { games, moves } from "@repo/database/src/schema/schema";
import { games, moves, users } from "@repo/database/src/schema/schema";
import logger from "../logger/logger";

const getGameById = async (gameId: string) => {
  //redisclient
  return await getMoves(client, gameId);
};

//calling this function when game ends, eithercheckmate,draw
// await saveGame(redisClient, gameId, "w");

//get the game played by a certain user
//assumption: that user exists

const findGamesByUser = async (userId: string) => {
  const whiteUser = alias(users, "whiteUser");
  const blackUser = alias(users, "blackUser");

  try {
    return await db
      .select({
        game: games,
        white: whiteUser.username,
        black: blackUser.username,
      })
      .from(games)
      .leftJoin(whiteUser, eq(games.whiteId, whiteUser.id))
      .leftJoin(blackUser, eq(games.blackId, blackUser.id))
      .where(or(eq(games.whiteId, userId), eq(games.blackId, userId)));
  } catch (error) {
    logger.error("error finding the game played by user", { userId });
    throw error;
  }
};

export { getGameById, findGamesByUser };
