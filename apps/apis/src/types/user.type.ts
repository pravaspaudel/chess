import * as z from "zod";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validation/user.validator";

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export type LoginUserInput = z.infer<typeof loginUserSchema>;
