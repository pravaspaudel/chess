type MoveTableProps = {
  pgn: string;
};

type PgnTableRow = {
  move: number;
  white: string;
  black: string;
};

const ShowMovesTable = ({ pgn }: MoveTableProps) => {
  const regex = /(\d+)\.\s*([^\s]+)(?:\s+([^\s]+))?/g;

  const rows: PgnTableRow[] = [];
  let matched: RegExpExecArray | null;

  while ((matched = regex.exec(pgn)) !== null) {
    rows.push({
      move: Number(matched[1]),
      white: matched[2],
      black: matched[3] && matched[3] !== "*" ? matched[3] : "",
    });
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Move</th>
          <th>White</th>
          <th>Black</th>
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <tr>
            <td>{row.move}</td>
            <td>{row.white}</td>
            <td>{row.black}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ShowMovesTable;
