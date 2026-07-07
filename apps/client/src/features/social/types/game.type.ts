export type UserGamesResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    games: UserGame[];
  };
};

export type UserGame = {
  game: Game;
  white: string;
  black: string;
};

export type Game = {
  id: string;
  whiteId: string;
  blackId: string;
  currentFen: string;
  pgn: string;
  winner: string | null;
  status: "completed" | "ongoing";
  whiteTimeMs: number;
  blackTimeMs: number;
  createdAt: string;
};
