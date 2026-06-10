import { Chess } from "chess.js";

type GameStatus = {
  isOver: boolean;
  message: string;
};

export function checkGameOver(game: Chess): GameStatus {
  if (game.isCheckmate()) {
    return {
      isOver: true,
      message: "game ends in checkmate",
    };
  }

  if (game.isStalemate()) {
    return {
      isOver: true,
      message: "game ends in stalemate",
    };
  }

  if (game.isThreefoldRepetition()) {
    return {
      isOver: true,
      message: "game ends with three fold repetition",
    };
  }

  if (game.isDrawByFiftyMoves()) {
    return {
      isOver: true,
      message: "game ends with draw because of fifty move draw rule",
    };
  }

  if (game.isInsufficientMaterial()) {
    return {
      isOver: true,
      message: "game drew by insufficient material",
    };
  }

  if (game.isDraw()) {
    return {
      isOver: true,
      message: "game ends with draw",
    };
  }

  return {
    isOver: false,
    message: "",
  };
}
