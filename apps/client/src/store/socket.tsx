import { create } from "zustand";
import useChessStore from "./chess";

type SocketStore = {
  socket: WebSocket | null;
  message: string | null;

  connect: () => void;
  disconnect: () => void;
  matchRequest: () => void;
};

const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  message: null,
  connect: () => {
    const existingWs = get().socket;

    if (existingWs) {
      return;
    }

    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
      console.log("connected");
    };

    ws.onmessage = (event) => {
      console.log("received", JSON.parse(event.data));
      const { type, message } = JSON.parse(event.data);

      //connected to the game
      if (type == "waiting") {
        set({ message: message });
      }

      if (type == "match_found") {
        const { color, gameId } = JSON.parse(event.data);

        useChessStore.getState().setGameId(gameId);
        useChessStore.getState().setColor(color);
      }

      if (type == "move") {
        const { fen, turn, whiteTime, blackTime } = JSON.parse(event.data);

        useChessStore.getState().setfen(fen);
        useChessStore.getState().setWhiteTime(whiteTime);
        useChessStore.getState().setBlackTime(blackTime);
        useChessStore.getState().setTurn(turn);
      }
    };

    ws.onclose = () => {
      console.log("disconnected");
      set({ socket: null });
    };

    set({ socket: ws });
  },
  disconnect: () => {
    const socket = get().socket;

    socket?.close();
    set({ socket: null });
  },

  matchRequest: () => {
    const socket = get().socket;

    if (!socket || socket.readyState != WebSocket.OPEN) {
      console.log("internal server error");
    }

    socket?.send(
      JSON.stringify({
        type: "find_match",
        matchtime: "3",
      }),
    );
  },
}));

export default useSocketStore;
