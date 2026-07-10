type MoveTableProps = {
  pgn: string;
};

type PgnTableRow = {
  move: number;
  white: string;
  black: string;
};

const ShowMovesTable = ({ pgn }: MoveTableProps) => {
  const moves = pgn
    .replace(/\[.*?\]\n?/g, "") // remove PGN headers
    .replace(/\*/g, "") // remove game result placeholder
    .trim()
    .split(/\s+/)
    .filter((token) => !/^\d+\.$/.test(token));

  const rows: PgnTableRow[] = [];

  for (let i = 0; i < moves.length; i += 2) {
    rows.push({
      move: Math.floor(i / 2) + 1,
      white: moves[i] ?? "",
      black: moves[i + 1] ?? "",
    });
  }

  return (
    <table className="w-full border-collapse border mt-4">
      <thead>
        <tr>
          <th className="border p-2">#</th>
          <th className="border p-2">White</th>
          <th className="border p-2">Black</th>
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <tr key={row.move}>
            <td className="border p-2">{row.move}</td>
            <td className="border p-2">{row.white}</td>
            <td className="border p-2">{row.black}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ShowMovesTable;
