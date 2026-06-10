import { Chess } from "chess.js";
import type { Square } from "chess.js";
import { checkGameOver } from "./gameOverCheck";

const game = new Chess();

export function testChessJS() {
  //gives a set of all possible moves
  const moves = game.moves();

  //   console.log(`moves are ${moves} and length is ${moves.length}`);

  //to check if game is over or not we do ;

  //   console.log(`initial fen is ${game.fen()}`);

  try {
    const bishopmove = "Fb4";
    game.move(bishopmove);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }

  try {
    const knightMove = "Nf3";
    game.move(knightMove);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
  }

  try {
    const move = "d5";
    game.move(move);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
  }

  try {
    const move = "d4";
    game.move(move);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
  }

  // game.isCheckmate()
  // game.isStalemate()
  // game.isDraw()

  const turn = game.turn();
  console.log(`turn is ${turn}`);

  //   while (!game.isGameOver()) {
  //     const moves = game.moves();
  //     const randomMove = moves[Math.floor(Math.random() * moves.length)];
  //     if (!randomMove) {
  //       console.log("gamve got failed in middle of nowhere");
  //       return;
  //     }
  //     game.move(randomMove);
  //   }

  console.log(game.pgn());

  const splitted = game.pgn().split("1");
  console.log("spliitted");
  console.log("1" + splitted[1]);
}

// testChessJS();

export function Game() {
  return new Chess();
}

export type { Square, Chess };
export { checkGameOver };
