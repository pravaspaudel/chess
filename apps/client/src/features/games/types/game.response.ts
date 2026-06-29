export interface Game {
  fen: string;
  moves: Array<string>;
  turn: "w" | "b";
  whiteId: string;
  blackId: string;
  whiteTime: number;
  blackTime: number;
}

export interface GameResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Game;
}
