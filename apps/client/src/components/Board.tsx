import { Chessboard } from "react-chessboard";
import type {
  ChessboardOptions,
  PieceDropHandlerArgs,
  SquareHandlerArgs,
} from "react-chessboard";
import type { Square } from "@repo/chess-utils";
import { useRef, useState } from "react";
import { Game } from "@repo/chess-utils";
import ShowMovesTable from "./ShowMovesTable";

const Board = () => {
  const gameRef = useRef(Game());

  const [position, setPosition] = useState(() => gameRef.current.fen());

  const [moveFrom, setMoveFrom] = useState<Square | "">("");
  const [optionsToMove, setOptionsToMove] = useState<
    Record<string, React.CSSProperties>
  >({});
  const [pgn, setPGN] = useState("");

  const onDrop = ({ sourceSquare, targetSquare }: PieceDropHandlerArgs) => {
    if (!targetSquare) return false;

    try {
      gameRef.current.move({
        from: sourceSquare,
        to: targetSquare,
      });

      setPosition(gameRef.current.fen());

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const getMoveOptions = (square: Square) => {
    const moves = gameRef.current.moves({
      square,
      verbose: true,
    });

    if (moves.length === 0) {
      setOptionsToMove({});
      return false;
    }

    const newSquares: Record<string, React.CSSProperties> = {};

    for (const move of moves) {
      newSquares[move.to] = {
        background: gameRef.current.get(move.to)
          ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
          : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    }

    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };

    setOptionsToMove(newSquares);

    return true;
  };

  const onSquareClick = ({ square, piece }: SquareHandlerArgs) => {
    //on first click what to do ??
    if (!square) {
      return;
    }

    if (!moveFrom && piece) {
      const hasMoveOptions = getMoveOptions(square as Square);

      if (hasMoveOptions) {
        setMoveFrom(square as Square);
      }
      return;
    }

    const moves = gameRef.current.moves({
      square: moveFrom as Square,
      verbose: true,
    });

    const foundMove = moves.find(
      (move) => move.from === moveFrom && move.to === square,
    );

    //this is the invalid move
    if (!foundMove) {
      const hasMoveOptions = piece ? getMoveOptions(square as Square) : false;

      setMoveFrom(hasMoveOptions ? (square as Square) : "");
      return;
    }

    try {
      gameRef.current.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      setPosition(gameRef.current.fen());
      setPGN(gameRef.current.pgn());

      setMoveFrom("");
      setOptionsToMove({});
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  };

  const chessOptions: ChessboardOptions = {
    allowDragging: false,
    allowDrawingArrows: true,
    alphaNotationStyle: { fontSize: "15px" },
    boardOrientation: "white",
    position: position,
    onPieceDrop: onDrop,
    squareStyles: optionsToMove,
    onSquareClick,
  };

  return (
    <div className="w-[400px]">
      <Chessboard options={chessOptions} />
      <ShowMovesTable pgn={pgn} />
    </div>
  );
};

export default Board;
