import * as z from "zod";
import type { loginUserSchema, registerUserSchema } from "../schema/auth";

export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: User;
}

export type RegisterResponse = LoginResponse;
export type MeResponse = LoginResponse;
