// one gameRoom has 2 players with their id maps to socket
import type WebSocket from "ws";
import type { MatchTime, WaitingPlayer } from "../types/game.type";
import { Game } from "@repo/chess-utils";
import { checkGameOver } from "@repo/chess-utils";
import type { Chess } from "@repo/chess-utils";
import { sendMessage } from "../utils/socket";

class GameRoom {
  readonly gameId: string;

  private whitePlayerId: string;
  private blackPlayerId: string;

  //only 2 options for now 3 or 3|2
  private whiteTime: number;
  private blackTime: number;

  private lastMoveTime = Date.now();

  //mapping playerId with the socket
  players: Map<string, WebSocket> = new Map();

  private isIncrement: boolean = false;
  private isGameOver = false;
  private game: Chess;

  constructor(
    gameId: string,
    whitePlayer: WaitingPlayer,
    blackPlayer: WaitingPlayer,
    time: MatchTime,
    private onGameOver: (gameId: string, players: string[]) => void,
  ) {
    this.gameId = gameId;

    this.whitePlayerId = whitePlayer.playerId;
    this.blackPlayerId = blackPlayer.playerId;

    this.players.set(whitePlayer.playerId, whitePlayer.socket);
    this.players.set(blackPlayer.playerId, blackPlayer.socket);

    this.game = Game();

    this.whiteTime = 180000;
    this.blackTime = 180000;

    if (time == "3") {
      this.isIncrement = false;
    } else if (time == "3|2") {
      this.isIncrement = true;
    }
  }

  handleMove(playerId: string, move: string) {
    const currentTurn = this.game.turn();

    //cannot further move if game is over
    if (this.isGameOver) {
      return this.sendError(playerId, "GAME_OVER", "Game already finished");
    }

    if (!this.isPlayerinRoom(playerId)) {
      return this.sendError(
        playerId,
        "UNAUTHORIZED",
        "You are not in the game",
      );
    }

    if (currentTurn == "w" && playerId != this.whitePlayerId) {
      return this.sendError(playerId, "NOT_YOUR_TURN", "It's not your turn");
    }

    if (currentTurn == "b" && playerId != this.blackPlayerId) {
      return this.sendError(playerId, "NOT_YOUR_TURN", "It's not your turn");
    }

    try {
      this.game.move(move);
    } catch (err) {
      return this.sendError(playerId, "INVALID_MOVE", "Invalid chess move");
    }

    //need to broadcasttime with move
    this.handleTime(currentTurn);

    if (this.isGameOver) {
      return;
    }

    this.broadcastMove(move);

    const status = checkGameOver(this.game);

    if (status.isOver) {
      this.isGameOver = true;
      this.broadcastResult(status.message);

      this.onGameOver(this.gameId, this.getPlayers());

      return;
    }
    //reset the lastMoveTime
    this.lastMoveTime = Date.now();
  }

  private broadcastMove(move: string) {
    const fen = this.game.fen();

    for (const [_, socket] of this.players) {
      sendMessage(socket, {
        type: "move",
        move: move,
        fen,
        turn: this.game.turn(),
        check: this.game.inCheck(),
        whiteTime: this.whiteTime,
        blackTime: this.blackTime,
      });
    }
  }

  private broadcastResult(message: string, winner?: "w" | "b" | null) {
    //winner null means game ended in draw
    let finalWinner: "w" | "b" | null = winner ?? null;

    if (
      finalWinner === null &&
      !message.toLowerCase().includes("draw") &&
      !message.toLowerCase().includes("stalemate")
    ) {
      finalWinner = this.game.turn() === "w" ? "b" : "w";
    }

    const fen = this.game.fen();

    for (const [_, socket] of this.players) {
      sendMessage(socket, {
        type: "game_over",
        winner: finalWinner,
        message,
        fen,
      });
    }
  }

  private sendError(playerId: string, code: string, message: string) {
    const socket = this.players.get(playerId);

    if (!socket) {
      return;
    }

    socket.send(
      JSON.stringify({
        type: "error",
        code,
        message,
      }),
    );
  }

  private isPlayerinRoom(playerId: string): boolean {
    return this.players.has(playerId);
  }

  getPlayers() {
    return Array.from(this.players.keys());
  }

  handlePlayerDisconnect(disconnectedPlayerId: string) {
    if (this.isGameOver) {
      return;
    }

    this.isGameOver = true;

    const winner = disconnectedPlayerId === this.whitePlayerId ? "b" : "w";

    for (const [playerId, socket] of this.players) {
      sendMessage(socket, {
        type: "game_over",
        winner,
        message: "Opponent disconnected",
      });
    }

    this.onGameOver(this.gameId, this.getPlayers());
  }

  //decrement the time after the move
  private handleTime(player: "w" | "b") {
    const diff = Date.now() - this.lastMoveTime;

    if (player == "w") {
      this.whiteTime -= diff;

      if (this.isIncrement) {
        this.whiteTime += 2000;
      }
    } else {
      this.blackTime -= diff;

      if (this.isIncrement) {
        this.blackTime += 2000;
      }
    }

    if (this.whiteTime <= 0 || this.blackTime <= 0) {
      this.isGameOver = true;

      const winner = this.whiteTime <= 0 ? "b" : "w";

      this.broadcastResult(
        `${winner === "w" ? "White" : "Black"} wins on time`,
        winner,
      );

      this.onGameOver(this.gameId, this.getPlayers());
    }
  }
}

export default GameRoom;
