import type WebSocket from "ws";

export function sendMessage(socket: WebSocket, payload: unknown) {
  socket.send(JSON.stringify(payload));
}
