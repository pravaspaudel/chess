// import { useState } from "react";
import { useNavigate } from "react-router";
import useSocketStore from "../store/socket";
import useChessStore from "../store/chess";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth";

const StartMatch = () => {
  //   const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const gameId = useChessStore((state) => state.gameId);
  const status = useSocketStore((state) => state.status);
  const matchRequest = useSocketStore((state) => state.matchRequest);

  const handleStartMatchClick = () => {
    if (!user) {
      console.log(
        "please authenticate to play match, game will not start till then",
      );
      return;
    }
    matchRequest();
  };

  useEffect(() => {
    if (status?.type == "match_found" && gameId) {
      localStorage.setItem("gameId", gameId);
      navigate(`/play/${gameId}`);
    }
  }, [gameId, navigate, status]);

  return (
    <div>
      <button
        className="p-4 bg-blue-500 text-white hover:bg-blue-600 rounded-sm"
        onClick={handleStartMatchClick}
      >
        Start the match
      </button>
    </div>
  );
};

export default StartMatch;
