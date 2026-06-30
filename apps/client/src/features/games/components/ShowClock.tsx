import { useEffect, useState } from "react";
import useChessStore from "../store/chess";

function formatTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <span>
      {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
}

export default function ShowClock() {
  const whiteTime = useChessStore((state) => state.whiteTime);
  const blackTime = useChessStore((state) => state.blackTime);
  const turn = useChessStore((state) => state.turn);
  const turnStartedAt = useChessStore((state) => state.turn);

  const [now, setNow] = useState(new Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const elapsed = now - turnStartedAt;

  const displayWhiteTime =
    turn === "white" ? Math.max(0, whiteTime - elapsed) : whiteTime;

  const displayBlackTime =
    turn === "black" ? Math.max(0, blackTime - elapsed) : blackTime;

  return (
    <div>
      <h1>this is the clock baby</h1>

      <span>whiteTime: {formatTime(displayWhiteTime)}</span>

      <span>blackTime: {formatTime(displayBlackTime)}</span>
    </div>
  );
}
