import { randomUUID } from "crypto";
import GameRoom from "./gameRoom";
import type {
  MatchMaking,
  WaitingPlayer,
  MoveMessage,
  MatchTime,
} from "../types/game.type";
import type WebSocket from "ws";
import { sendMessage } from "../utils/socket";

//manages multiple Games
export class GameManager {
  //gameId -> gameRoom
  games: Map<string, GameRoom> = new Map();

  //playerToGame: Map<playerId,gameId>
  playerToGame: Map<string, string> = new Map();

  //todo: different queue for player with different match time request;

  private waitingPlayer: (WaitingPlayer & { matchTime: MatchTime }) | null =
    null;
  // private waitingPlayer: WaitingPlayer | null = null;

  handleIncomingMessage(
    message: MatchMaking | MoveMessage,
    playerId: string,
    socket: WebSocket,
  ) {
    switch (message.type) {
      case "find_match":
        this.addPlayer(playerId, socket, message.matchtime);
        break;
      case "move":
        this.handleMove(message, playerId, socket);
    }
  }

  private addPlayer(id: string, socket: WebSocket, matchTime: MatchTime) {
    if (this.playerToGame.has(id)) {
      return sendMessage(socket, {
        type: "error",
        code: "ALREADY_IN_GAME",
        message: "you are already in game",
      });
    }

    if (!this.waitingPlayer) {
      this.waitingPlayer = {
        playerId: id,
        socket: socket,
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
      playerId: id,
      socket: socket,
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

    this.playerToGame.set(player1.playerId, gameId);
    this.playerToGame.set(player2.playerId, gameId);
  }

  private handleMove(
    message: MoveMessage,
    playerId: string,
    socket: WebSocket,
  ) {
    const room = this.games.get(message.gameId);

    if (!room) {
      return sendMessage(socket, {
        type: "error",
        code: "GAME_NOT_FOUND",
        message: "game does not exists",
      });
    }

    room.handleMove(playerId, message.move);
  }

  handleDisconnect(playerId: string) {
    if (this.waitingPlayer && this.waitingPlayer.playerId == playerId) {
      this.waitingPlayer = null;
    }

    const gameId = this.playerToGame.get(playerId);

    if (!gameId) {
      return;
    }

    const room = this.games.get(gameId);

    if (!room) {
      this.playerToGame.delete(playerId);
      return;
    }

    room.handlePlayerDisconnect(playerId);

    const players = room.getPlayers();

    for (const id of players) {
      this.playerToGame.delete(id);
    }

    this.games.delete(gameId);
  }

  private cleanupGame(gameId: string, players: string[]) {
    for (const playerId of players) {
      this.playerToGame.delete(playerId);
    }

    this.games.delete(gameId);
  }
}
