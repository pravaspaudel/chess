import fetchAPI from "@/shared/api/fetchapi";

const findGameById = async (gameId: string) => {
  const game = await fetchAPI(`game/${gameId}`, "GET");
  return game;
};

export { findGameById };
