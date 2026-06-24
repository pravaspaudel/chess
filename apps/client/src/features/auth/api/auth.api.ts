import fetchAPI from "@/shared/api/fetchapi";
import type {
  LoginResponse,
  LoginUser,
  MeResponse,
  RegisterUser,
  RegisterResponse,
} from "../types/user.type";

const registerUser = async (user: RegisterUser) => {
  return await fetchAPI<RegisterResponse>("register", "POST", {
    body: JSON.stringify(user),
  });
};

const loginUser = async (user: LoginUser): Promise<LoginResponse> => {
  console.log("inside login user");

  return await fetchAPI<LoginResponse>("login", "POST", {
    body: JSON.stringify(user),
  });
};

const getMe = async (): Promise<MeResponse> => {
  return await fetchAPI<MeResponse>("me", "GET");
};

export { registerUser, loginUser, getMe };
