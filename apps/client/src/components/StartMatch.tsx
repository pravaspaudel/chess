// import { useState } from "react";
import useSocketStore from "../store/socket";

const StartMatch = () => {
  //   const [message, setMessage] = useState("");

  const matchRequest = useSocketStore((state) => state.matchRequest);

  const handleStartMatchClick = () => {
    console.log("start match is clicked");
    matchRequest();
  };

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
