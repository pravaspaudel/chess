import type WebSocket from "ws";

export type GameMsg = {
  to: string;
  from: string;
  type: "move";
  move: string;
};

export type InitWsMsg = {
  type: "connected";
  id: string; //id of opponent's socket
};

export type MatchTime = "3" | "3|2";

export type MatchMaking = {
  type: "find_match";
  //either 3 or 3|2 for now
  matchtime: MatchTime;
};

export type WaitingPlayer = {
  playerId: string;
  socket: WebSocket;
};

export type MoveMessage = {
  type: "move";
  gameId: string;
  move: string;
};
