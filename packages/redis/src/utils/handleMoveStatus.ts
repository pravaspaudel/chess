import type { RedisClientType } from "redis";
// import type { Square } from "@repo/chess-utils";

//gameState -> what we are going to store in redis

type gameState = {
  gameId: string;
  fen: string;
  whiteId: string;
  blackId: string;
  moves: Array<string>;
  turn: "w" | "b";

  //time are in ms
  whiteTime: number;
  blackTime: number;
};

//this gets updated after very move
export const saveMove = async (client: RedisClientType, state: gameState) => {
  const { gameId, ...gameState } = state;

  await client.set(`game:${gameId}`, JSON.stringify(gameState));
};

export const getMove = async (client: RedisClientType, gameId: string) => {
  return await client.get(`game:${gameId}`);
};
