// one gameRoom has 2 players with their id maps to socket
import type WebSocket from "ws";
import type { MatchTime, RoomPlayer, WaitingPlayer } from "../types/game.type";
import { Game } from "@repo/chess-utils";
import { checkGameOver } from "@repo/chess-utils";
import type { Chess } from "@repo/chess-utils";
import { sendMessage } from "../utils/socket";
import { client, saveGameToRedis, saveGameToDB } from "@repo/redis";

class GameRoom {
  readonly gameId: string;

  private whitePlayer: RoomPlayer;
  private blackPlayer: RoomPlayer;

  //only 2 options for now 3 or 3|2
  private whiteTime: number;
  private blackTime: number;

  private whiteTimeHistory: number[] = [];
  private blackTimeHistory: number[] = [];

  private lastMoveTime = Date.now();

  //mapping playerId with the socket
  // players: Map<string, RoomPlayer> = new Map();
  //only 2 player exists in room at one time
  player: RoomPlayer[] = [];

  private isIncrement: boolean = false;
  private isGameOver = false;
  private game: Chess;

  constructor(
    gameId: string,
    whitePlayer: WaitingPlayer,
    blackPlayer: WaitingPlayer,
    time: MatchTime,
    private onGameOver: (gameId: string, players: RoomPlayer[]) => void,
  ) {
    this.gameId = gameId;

    this.whitePlayer = whitePlayer;
    this.blackPlayer = blackPlayer;

    // this.whitePlayerId = whitePlayer.playerId;
    // this.blackPlayerId = blackPlayer.playerId;
    // this.players.set(whitePlayer);

    // this.players.set(whitePlayer.playerId, whitePlayer.socket);
    // this.players.set(blackPlayer.playerId, blackPlayer.socket);
    this.player = [this.whitePlayer, this.blackPlayer];

    this.game = Game();

    this.whiteTime = 180000;
    this.blackTime = 180000;

    if (time == "3") {
      this.isIncrement = false;
    } else if (time == "3|2") {
      this.isIncrement = true;
    }
  }

  private getPlayerBySocketId(socketId: string): RoomPlayer | undefined {
    return this.player.find((p) => socketId == p.socketId);
  }

  async handleMove(socketId: string, move: string) {
    const player = this.getPlayerBySocketId(socketId);

    if (!player) {
      console.log("handlemove error no player found :  ", player);
      return;
    }

    const currentTurn = this.game.turn();

    //cannot further move if game is over
    if (this.isGameOver) {
      return this.sendError(
        player.socketId,
        "GAME_OVER",
        "Game already finished",
      );
    }

    if (currentTurn == "w" && player.userId != this.whitePlayer.userId) {
      return this.sendError(socketId, "NOT_YOUR_TURN", "It's not your turn");
    }

    if (currentTurn == "b" && player.userId != this.blackPlayer.userId) {
      return this.sendError(socketId, "NOT_YOUR_TURN", "It's not your turn");
    }

    try {
      this.game.move(move);
    } catch (err) {
      return this.sendError(
        player.socketId,
        "INVALID_MOVE",
        "Invalid chess move",
      );
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

      try {
        await saveGameToDB(
          this.gameId,
          this.whiteTimeHistory,
          this.blackTimeHistory,
        );

        this.onGameOver(this.gameId, this.getPlayers());
      } catch (err) {
        console.error("Failed to persist finished game:", err);
      }

      return;
    }
    //reset the lastMoveTime
    this.lastMoveTime = Date.now();
  }

  private broadcastMove(move: string) {
    const fen = this.game.fen();

    for (const player of this.player) {
      sendMessage(player.socket, {
        type: "move",
        move: move,
        fen,
        turn: this.game.turn(),
        check: this.game.inCheck(),
        whiteTime: this.whiteTime,
        blackTime: this.blackTime,
      });
    }

    //state of game to store in redis
    const state = {
      gameId: this.gameId,
      fen,
      moves: this.game.history(),
      turn: String(this.game.turn()) as "w" | "b",
      whiteId: this.whitePlayer.userId,
      blackId: this.blackPlayer.userId,
      whiteTime: this.whiteTime,
      blackTime: this.blackTime,
      // status: "ongoing",
      status: "ongoing" as const,
      winner: null,
    };

    saveGameToRedis(client, state).catch((err) => {
      console.log("redis save failed: ", err);
    });
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

    for (const player of this.player) {
      sendMessage(player.socket, {
        type: "game_over",
        winner: finalWinner,
        message,
        fen,
      });
    }
  }

  private sendError(socketId: string, code: string, message: string) {
    const playerSocket = this.getPlayerBySocketId(socketId);

    if (!playerSocket) {
      return;
    }

    playerSocket.socket.send(
      JSON.stringify({
        type: "error",
        code,
        message,
      }),
    );
  }

  private isPlayerInRoom(socketId: string): boolean {
    return this.player.some((p) => p.socketId == socketId);
  }

  getPlayers(): RoomPlayer[] {
    return this.player;
  }

  handlePlayerDisconnect(socketId: string) {
    const player = this.getPlayerBySocketId(socketId);

    if (!player) {
      return;
    }

    if (this.isGameOver) {
      return;
    }

    this.isGameOver = true;

    const winner = player.userId === this.whitePlayer.userId ? "b" : "w";

    for (const player of this.player) {
      sendMessage(player.socket, {
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

      this.whiteTimeHistory.push(this.whiteTime);
    } else {
      this.blackTime -= diff;

      if (this.isIncrement) {
        this.blackTime += 2000;
      }

      this.blackTimeHistory.push(this.blackTime);
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
