import { Input } from "@/shared/ui/input";
import { useEffect, useState } from "react";
import searchPlayerApi from "../api/search.user.api";
import type { SearchedUser } from "../../landing/types/user.type";
import { Link } from "react-router";

const SearchUser = () => {
  const [searchResult, setSearchResult] = useState<SearchedUser[]>([]);
  const [inputVal, setInputVal] = useState("");

  const handleSearchBar = (input: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(input.target.value);
  };

  useEffect(() => {
    if (!inputVal) {
      return;
    }

    const handler = setTimeout(async () => {
      try {
        const players = await searchPlayerApi(inputVal);
        setSearchResult(players.data);
      } catch (error) {
        console.error("search failed", error);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [inputVal]);

  return (
    <div>
      <h1>search friends here</h1>

      <Input placeholder="search people...." onChange={handleSearchBar} />

      <div>
        {searchResult &&
          searchResult.map((user: SearchedUser) => (
            <Link to={`/social/users/${user.id}`}>
              <div key={user.id}>{user.username}</div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default SearchUser;
