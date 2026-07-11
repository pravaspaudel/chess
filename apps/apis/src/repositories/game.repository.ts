import { client } from "@repo/redis";
import { getMoves } from "@repo/redis";
import { db, or, eq, alias, asc } from "@repo/database";
// import { games, moves } from "@repo/database/src/schema/schema";
import { games, moves, users } from "@repo/database/src/schema/schema";

import logger from "../logger/logger";

const getGameById = async (gameId: string) => {
  console.log("getGameById, game.repos.ts");

  //redisclient
  const move = await getMoves(client, gameId);
  if (move) {
    return move;
  }

  const whiteUser = alias(users, "whiteUser");
  const blackUser = alias(users, "blackUser");

  //if game not in redis,
  const [game] = await db
    .select({
      id: games.id,
      whiteId: games.whiteId,
      blackId: games.blackId,
      whiteUsername: whiteUser.username,
      blackUsername: blackUser.username,
      currentFen: games.currentFen,
      pgn: games.pgn,
      winner: games.winner,
      status: games.status,
      whiteTimeMs: games.whiteTimeMs,
      blackTimeMs: games.blackTimeMs,
      createdAt: games.createdAt,
    })
    .from(games)
    .leftJoin(whiteUser, eq(games.whiteId, whiteUser.id))
    .leftJoin(blackUser, eq(games.blackId, blackUser.id))
    .where(eq(games.id, gameId));

  const gameMoves = await db
    .select({
      move: moves.move,
      moveNumber: moves.moveNumber,
      whiteTime: moves.whiteTimeMs,
      blackTime: moves.blackTimeMs,
    })
    .from(moves)
    .where(eq(moves.gameId, gameId))
    .orderBy(asc(moves.moveNumber));

  return {
    ...game,
    moves: gameMoves,
  };
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
