import type { RedisClientType } from "redis";

//gameState -> what we are going to store in redis

type gameState = {
  gameId: string;
  fen: string;
  whiteId: string;
  blackId: string;
  moves: Array<string>;
  turn: "w" | "b";

  status: "ongoing" | "completed";
  winner: "b" | "w" | "draw" | null;
  //time are in ms
  whiteTime: number;
  blackTime: number;
};

//this gets updated after very move
export const saveGameToRedis = async (
  client: RedisClientType,
  state: gameState,
) => {
  const { gameId, ...gameState } = state;

  await client.set(`game:${gameId}`, JSON.stringify(gameState));
};

export const getMoves = async (
  client: RedisClientType,
  gameId: string,
): Promise<gameState> => {
  const game = await client.get(`game:${gameId}`);

  if (!game) {
    throw new Error("no game exists");
  }

  return JSON.parse(game) as gameState;
};
