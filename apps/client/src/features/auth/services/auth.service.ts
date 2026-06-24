import { loginUser, registerUser } from "../api/auth.api";
import type { LoginUser, RegisterUser } from "../types/user.type";

const login = async (payload: LoginUser) => {
  const response = await loginUser(payload);

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
};

const signup = async (payload: RegisterUser) => {
  const response = await registerUser(payload);

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
};

export { login, signup };
