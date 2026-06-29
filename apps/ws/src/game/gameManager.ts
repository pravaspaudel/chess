import { randomUUID } from "crypto";
import GameRoom from "./gameRoom";
import type {
  MatchMaking,
  WaitingPlayer,
  MoveMessage,
  MatchTime,
  RoomPlayer,
} from "../types/game.type";
import type WebSocket from "ws";
import { sendMessage } from "../utils/socket";

//manages multiple Games
export class GameManager {
  //gameId -> gameRoom
  games: Map<string, GameRoom> = new Map();

  //playerToGame: Map<playerId,gameId>
  // playerToGame: Map<string, string> = new Map();

  userToGame: Map<string, string> = new Map();
  socketToGame: Map<string, string> = new Map();

  private waitingPlayer: (WaitingPlayer & { matchTime: MatchTime }) | null =
    null;
  // private waitingPlayer: WaitingPlayer | null = null;

  handleIncomingMessage(
    message: MatchMaking | MoveMessage,
    userId: string,
    socket: WebSocket,
    socketId: string,
  ) {
    switch (message.type) {
      case "find_match":
        this.addPlayer(userId, socketId, socket, message.matchtime);
        break;
      case "move":
        this.handleMove(message, socketId, socket);
    }
  }

  private addPlayer(
    userId: string,
    socketId: string,
    socket: WebSocket,
    matchTime: MatchTime,
  ) {
    if (this.userToGame.has(userId)) {
      return sendMessage(socket, {
        type: "error",
        code: "ALREADY_IN_GAME",
        message: "you are already in game",
      });
    }

    if (!this.waitingPlayer) {
      this.waitingPlayer = {
        userId,
        socketId,
        socket,
        matchTime,
      };

      return sendMessage(socket, {
        type: "waiting",
        message: "waiting for opponents",
      });
    }

    if (this.waitingPlayer.matchTime !== matchTime) {
      return sendMessage(socket, {
        type: "waiting",
        message: "Waiting for same time control opponent",
      });
    }

    const me: WaitingPlayer = {
      userId,
      socketId,
      socket,
    };

    this.createGame(me, this.waitingPlayer, matchTime);
    this.waitingPlayer = null;
  }

  private createGame(
    player1: WaitingPlayer,
    player2: WaitingPlayer,
    matchTime: MatchTime,
  ) {
    const gameId = randomUUID();

    const randomNum = Math.floor(Math.random() * 2);

    let room: GameRoom;

    if (randomNum == 1) {
      room = new GameRoom(
        gameId,
        player1,
        player2,
        matchTime,
        this.cleanupGame.bind(this),
      );

      player1.socket.send(
        JSON.stringify({
          type: "match_found",
          gameId: gameId,
          color: "w",
        }),
      );

      player2.socket.send(
        JSON.stringify({
          type: "match_found",
          gameId: gameId,
          color: "b",
        }),
      );
    } else {
      room = new GameRoom(
        gameId,
        player2,
        player1,
        matchTime,
        this.cleanupGame.bind(this),
      );

      player2.socket.send(
        JSON.stringify({
          type: "match_found",
          gameId: gameId,
          color: "w",
        }),
      );

      player1.socket.send(
        JSON.stringify({
          type: "match_found",
          gameId: gameId,
          color: "b",
        }),
      );
    }
    this.games.set(gameId, room);

    this.socketToGame.set(player1.socketId, gameId);
    this.socketToGame.set(player2.socketId, gameId);

    this.userToGame.set(player1.userId, gameId);
    this.userToGame.set(player2.userId, gameId);
  }

  private handleMove(
    message: MoveMessage,
    socketId: string,
    socket: WebSocket,
  ) {
    const room = this.games.get(message.gameId);

    console.log("room is existing right now");

    if (!room) {
      console.log("room doesn't exists sorry");

      return sendMessage(socket, {
        type: "error",
        code: "GAME_NOT_FOUND",
        message: "game does not exists",
      });
    }

    room.handleMove(socketId, message.move);
  }

  handleDisconnect(socketId: string) {
    if (this.waitingPlayer && this.waitingPlayer.socketId == socketId) {
      this.waitingPlayer = null;
    }

    const gameId = this.socketToGame.get(socketId);

    if (!gameId) {
      return;
    }

    const room = this.games.get(gameId);

    if (!room) {
      // this.playerToGame.delete(playerId);
      this.socketToGame.delete(socketId);
      return;
    }

    room.handlePlayerDisconnect(socketId);

    const players = room.getPlayers();

    for (const player of players) {
      this.socketToGame.delete(player.socketId);
      this.userToGame.delete(player.userId);
    }

    this.games.delete(gameId);
  }

  private cleanupGame(gameId: string, players: RoomPlayer[]) {
    for (const player of players) {
      this.socketToGame.delete(player.socketId);
      this.userToGame.delete(player.userId);
    }

    this.games.delete(gameId);
  }
}
