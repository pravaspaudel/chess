import { WebSocketServer } from "ws";
import { randomUUID } from "crypto";
import type { InitWsMsg, MatchMaking } from "./types/game.type";
import { GameManager } from "./game/gameManager";
import { sendMessage } from "./utils/socket";
import { startRedis } from "@repo/redis";
import "dotenv/config";

const wss = new WebSocketServer({ port: 5000 });
const gameManager = new GameManager();

startRedis();

wss.on("connection", (socket) => {
  //on connection send this msg
  console.log("client connected successfully hehe");

  const initMsg: InitWsMsg = {
    type: "connected",
    id: randomUUID(),
  };
  socket.send(JSON.stringify(initMsg));

  socket.on("message", (msg) => {
    //todo add a zod validation schema here
    try {
      const parsed = JSON.parse(msg.toString());

      console.log("parsed on socket are ", parsed);

      gameManager.handleIncomingMessage(
        parsed,
        parsed.userId,
        socket,
        initMsg.id,
      );
    } catch (error) {
      sendMessage(socket, {
        type: "error",
        code: "INVALID_JSON",
        message: "invalid message forat",
      });
    }
  });

  socket.on("close", () => {
    gameManager.handleDisconnect(initMsg.id);
  });

  socket.on("error", (err) => {
    console.log(`error connecting to socket : ${err}`);
  });
});
