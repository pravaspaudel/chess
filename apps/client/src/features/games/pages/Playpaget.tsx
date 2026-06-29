import ShowProfile from "@/shared/components/ShowProfile";
import Board from "../components/Board";
import StartMatch from "../components/StartMatch";
// import { useParams } from "react-router";
import useSocketStore from "../store/socket";

const Playpaget = () => {
  const status = useSocketStore((state) => state.status);
  console.log("status is ", status);

  return (
    <div>
      <Board />
      {/* <ShowMovesTable/> */}
      <StartMatch />

      <div>{status && <span>{status.message}</span>}</div>

      <ShowProfile />
    </div>
  );
};

export default Playpaget;
