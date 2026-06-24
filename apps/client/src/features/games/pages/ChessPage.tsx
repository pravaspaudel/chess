import Board from "../../../components/Board";
// import ShowMovesTable from "@/components/ShowMovesTable";
import StartMatch from "../../../components/StartMatch";

const ChessPage = () => {
  return (
    <div>
      <Board />
      {/* <ShowMovesTable/> */}
      <StartMatch />
    </div>
  );
};

export default ChessPage;
