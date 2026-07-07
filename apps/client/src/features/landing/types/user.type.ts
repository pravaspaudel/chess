//response from hitting /users?username= api

export type SearchResponse = {
  success: true;
  statusCode: number;
  message: string;
  data: SearchedUser[] | [];
};

export type SearchedUser = {
  id: string;
  username: string;
  email: string;
};
