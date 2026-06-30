import { client } from "..";
import { getMoves } from "./handleMoveStatus";
import { db } from "@repo/database";
import { games, moves } from "@repo/database/src/schema/schema";

export const saveGameToDB = async (
  gameId: string,
  whiteTimeHistory: number[],
  blackTimeHistory: number[],
) => {
  //save the game
  const game = await getMoves(client, gameId);

  const [insertedGame] = await db
    .insert(games)
    .values({
      whiteId: game.whiteId,
      blackId: game.blackId,
      currentFen: game.fen,
      pgn: game.moves.join(" "),
      winner: game.winner,
      status: "completed",
      whiteTimeMs: game.whiteTime,
      blackTimeMs: game.blackTime,
    })
    .returning();

  if (!insertedGame) {
    throw new Error("Failed to insert game");
  }

  await db.insert(moves).values(
    game.moves.map((move: string, index: number) => ({
      gameId: insertedGame.id,
      move,
      moveNumber: index + 1,
      whiteTimeMs: whiteTimeHistory[Math.floor(index / 2)] ?? game.whiteTime,
      blackTimeMs:
        blackTimeHistory[Math.floor((index - 1) / 2)] ?? game.blackTime,
    })),
  );

  await client.del(`game:${gameId}`);

  return insertedGame;
};
