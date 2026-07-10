import { useEffect } from "react";
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
import useChessStore from "../store/chess";
import ShowClock from "./ShowClock";
import GameOverModel from "./GameOverModel";

const Board = () => {
  const gameRef = useRef(Game());

  // const [position, setPosition] = useState(() => gameRef.current.fen());
  const fen = useChessStore((state) => state.fen);

  useEffect(() => {
    if (fen) {
      gameRef.current.load(fen);
    }
  }, [fen]);

  const position = fen;

  const turn = useChessStore((state) => state.turn);
  const makeMove = useChessStore((state) => state.movepiece);
  const color = useChessStore((state) => state.color);
  const gameId = useChessStore((state) => state.gameId);
  const pgn = useChessStore((state) => state.pgn);

  // console.log("gameId:", gameId);
  // console.log("color on Board.tsx", color);

  // console.log("board.tsx logs", gameId, color, fen, turn);

  const [moveFrom, setMoveFrom] = useState<Square | "">("");
  const [optionsToMove, setOptionsToMove] = useState<
    Record<string, React.CSSProperties>
  >({});

  // useEffect(() => {
  //   // console.log("BOARD FEN CHANGED", fen);
  // }, [fen]);

  // useEffect(() => {
  //   // console.log("BOARD COLOR CHANGED", color);
  // }, [color]);

  const onDrop = ({ sourceSquare, targetSquare }: PieceDropHandlerArgs) => {
    if (!targetSquare || !gameId) return false;
    if (color !== turn) return false;

    try {
      const move = gameRef.current.move({
        from: sourceSquare,
        to: targetSquare,
      });

      if (!move) return false;

      makeMove(move.san);

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

    if (color !== turn) return;

    if (!square || !gameId) {
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
      // gameRef.current.move({
      //   from: moveFrom,
      //   to: square,
      //   promotion: "q",
      // });

      // makeMove(square);

      // setPosition(gameRef.current.fen());
      // setPGN(gameRef.current.pgn());

      makeMove(foundMove.san);

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
    boardOrientation: color === "w" ? "white" : "black",
    position: position,
    onPieceDrop: onDrop,
    squareStyles: optionsToMove,
    onSquareClick,
  };

  return (
    <div className="relative flex gap-6 items-start">
      <GameOverModel />

      <div className="w-[500px]">
        <Chessboard options={chessOptions} />
      </div>

      <div className="w-[300px] flex flex-col gap-4">
        <h1>
          <span>white color</span>
          <ShowClock color="w" />
        </h1>

        <h1>
          <span>black color</span>
          <ShowClock color="b" />
        </h1>
        <ShowMovesTable pgn={pgn} />
      </div>
    </div>
  );
};

export default Board;
