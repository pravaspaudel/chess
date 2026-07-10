import { create } from "zustand";
import useSocketStore from "./socket";

type ChessStore = {
  gameId: string | null;
  color: "w" | "b" | null;
  pgn: string;
  fen: string;
  whiteTime: number;
  blackTime: number;
  turn: "w" | "b";
  // turnStartedAt: number;
  serverTime: number;
  gameOver: boolean;
  winner: "w" | "b" | "draw" | null;

  // setTurnStartedAt: (turnStartedAt: number) => void;
  setGameOver: (winner: "w" | "b" | "draw") => void;
  setServerTime: (sTime: number) => void;
  setTurn: (turn: "w" | "b") => void;
  setWhiteTime: (time: number) => void;
  setBlackTime: (time: number) => void;
  setFen: (fen: string) => void;
  setpgn: (pgn: string) => void;
  setColor: (color: "w" | "b") => void;
  setGameId: (id: string) => void;
  movepiece: (move: string) => void;

  resetGame: () => void;
};
// {
//   "type": "move",
//   "gameId": "2734cf28-4060-4d8c-a11b-2fe5a4191b4a",
//   "move": "Nc6"
// }

//it handles sending moves
const useChessStore = create<ChessStore>((set, get) => ({
  gameId: null,
  color: "w",
  pgn: "",
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  turn: "w",
  whiteTime: 18000,
  blackTime: 18000,
  serverTime: 0,
  gameOver: false,
  winner: null,
  // turnStartedAt: Date.now(),

  setGameOver: (winner: "w" | "b" | "draw") =>
    set({ gameOver: true, winner: winner }),
  // setTurnStartedAt: (startedAt: number) => set({ turnStartedAt: startedAt }),
  setTurn: (turn: "w" | "b") => set({ turn: turn }),
  setGameId: (id) => set({ gameId: id }),
  setColor: (color) => set({ color: color }),
  setpgn: (pgn) => set({ pgn: pgn }),
  setFen: (fen) => set({ fen: fen }),
  setWhiteTime: (whiteTime) => set({ whiteTime: whiteTime }),
  setBlackTime: (blackTime) => set({ blackTime: blackTime }),
  setServerTime: (sTime: number) => set({ serverTime: sTime }),

  movepiece: (move: string) => {
    const socket = useSocketStore.getState().socket;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.log("issue in server while making a move");
      return;
    }

    const gameId = get().gameId;

    if (!gameId) {
      console.log("you are not in any game currently");
      return;
    }

    socket.send(
      JSON.stringify({
        type: "move",
        gameId: gameId,
        move: move,
      }),
    );
  },

  resetGame: () =>
    set({
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      pgn: "",
      turn: "w",
      whiteTime: 180000,
      blackTime: 180000,
      gameOver: false,
      winner: null,
      serverTime: Date.now(),
    }),
}));

export default useChessStore;
