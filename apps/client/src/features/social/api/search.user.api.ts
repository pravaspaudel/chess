import fetchAPI from "@/shared/api/fetchapi";
import type { SearchResponse } from "../../landing/types/user.type";

const searchPlayerApi = async (username: string): Promise<SearchResponse> => {
  return await fetchAPI<SearchResponse>(`/users?username=${username}`, "GET");
};

export default searchPlayerApi;
