import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import type { UserGame } from "../types/game.type";
import { getGamePlayedByUser } from "../api/games.api";

const UserPage = () => {
  const [games, setGames] = useState<UserGame[]>([]);
  const [error, setError] = useState("");

  const params = useParams();

  useEffect(() => {
    const getGames = async () => {
      try {
        if (!params.userId) {
          return;
        }

        const response = await getGamePlayedByUser(params.userId);

        if (!response.success) {
          setError(response.message);
          return;
        }

        setGames(response.data.games);

        console.log("response is", response);
      } catch (error) {
        console.log("some error in getGames", error);
        setError("Failed to fetch games");
      }
    };

    getGames();
  }, [params.userId]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>

      <h2>Games Played</h2>

      {games.length === 0 ? (
        <p>No games played yet.</p>
      ) : (
        <div>
          {games.map(({ game, white, black }) => (
            <Link
              key={game.id}
              to={`/game/${game.id}`}
              className="block border p-4 rounded-md mb-3 hover:bg-gray-100"
            >
              <div>
                <strong>White:</strong> {white}
              </div>

              <div>
                <strong>Black:</strong> {black}
              </div>

              <div>
                <strong>Status:</strong> {game.status}
              </div>

              <div>
                <strong>PGN:</strong> {game.pgn}
              </div>

              <div>
                <strong>Played on:</strong>{" "}
                {new Date(game.createdAt).toLocaleString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPage;
