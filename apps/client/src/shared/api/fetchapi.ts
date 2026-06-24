const URL = import.meta.env.VITE_SERVER_URL;

type Method = "POST" | "GET" | "PATCH" | "DELETE";

const fetchAPI = async <T>(
  endpoint: string,
  method: Method,
  options = {},
): Promise<T> => {
  const response = await fetch(`${URL}${endpoint}`, {
    method,
    headers: {
      "Content-type": "Application/json",
    },
    credentials: "include",
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "something went wrong");
  }

  return data;
};

export default fetchAPI;
