// import Board from "../../../components/Board";
import Board from "../components/Board";
// import ShowMovesTable from "@/components/ShowMovesTable";
import StartMatch from "../components/StartMatch";
import ShowProfile from "@/shared/components/ShowProfile";
// import { useParams } from "react-router";

const ChessPage = () => {
  // const { gameId } = useParams();

  return (
    <div>
      <Board />
      {/* <ShowMovesTable/> */}
      <StartMatch />
      <ShowProfile />
    </div>
  );
};

export default ChessPage;
