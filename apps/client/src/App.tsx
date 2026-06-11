import Board from "./components/Board";
import "./App.css";
import useSocketStore from "./store/socket";
import { useEffect } from "react";
import StartMatch from "./components/StartMatch";

const App = () => {
  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return (
    <div>
      <h1>this is app.jsx</h1>
      <Board />
      <StartMatch />
    </div>
  );
};

export default App;
