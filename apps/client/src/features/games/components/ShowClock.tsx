import { useEffect, useState } from "react";
import useChessStore from "../store/chess";

function formatTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function ShowClock({ color }: { color: "w" | "b" }) {
  const { whiteTime, blackTime, turn, serverTime } = useChessStore();

  const [displayTime, setDisplayTime] = useState(0);

  useEffect(() => {
    console.log("use effect in ShowClock.tsx just ran");
    const updateClock = () => {
      const elapsedTime = Date.now() - serverTime;

      let currentWhite = whiteTime;
      let currentBlack = blackTime;

      if (turn === "w") {
        currentWhite = Math.max(0, whiteTime - elapsedTime);
      } else {
        currentBlack = Math.max(0, blackTime - elapsedTime);
      }

      setDisplayTime(color === "w" ? currentWhite : currentBlack);
    };

    updateClock();

    //for displaying the ime
    const interval = setInterval(updateClock, 100);

    return () => clearInterval(interval);
  }, [whiteTime, blackTime, turn, serverTime, color]);

  return (
    <div>
      <h1>{formatTime(displayTime)}</h1>
    </div>
  );
}
