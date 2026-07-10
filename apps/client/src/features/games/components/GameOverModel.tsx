import { useEffect, useState } from "react";
import useChessStore from "../store/chess";

const GameOverModel = () => {
  const { gameOver, winner } = useChessStore();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, [gameOver]);

  if (!gameOver || !open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 text-xl font-bold text-gray-500 hover:text-black"
        >
          ×
        </button>

        <h2 className="mb-4 text-2xl font-bold">Game Over</h2>

        <p>
          Winner: {winner === "w" ? "White" : winner === "b" ? "Black" : "Draw"}
        </p>

        <button className="bg-blue-100 p-3 rounded-lg hover:bg-blue-200">
          play again
        </button>
      </div>
    </div>
  );
};

export default GameOverModel;
