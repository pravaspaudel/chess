import { useEffect, useState } from "react";
import useChessStore from "../store/chess";

function formatTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function ShowClock() {
  const turn = useChessStore((state) => state.turn);
  const whiteTime = useChessStore((state) => state.whiteTime);
  const blackTime = useChessStore((state) => state.blackTime);
  const turnStartedAt = useChessStore((state) => state.turnStartedAt);

  console.log({
    whiteTime: whiteTime,
    blackTime: blackTime,
  });

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const elapsed = turnStartedAt > 0 ? now - turnStartedAt : 0;

  const whiteDisplay = turn === "w" ? whiteTime - elapsed : whiteTime;

  const blackDisplay = turn === "b" ? blackTime - elapsed : blackTime;

  return (
    <div>
      <div>White: {formatTime(Math.max(0, whiteDisplay))}</div>

      <div>Black: {formatTime(Math.max(0, blackDisplay))}</div>
    </div>
  );
}
