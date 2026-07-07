import type { UserGamesResponse } from "../types/game.type";
import fetchAPI from "@/shared/api/fetchapi";

export const getGamePlayedByUser = async (
  userId: string,
): Promise<UserGamesResponse> => {
  return await fetchAPI(`/users/${userId}/games`, "GET");
};
