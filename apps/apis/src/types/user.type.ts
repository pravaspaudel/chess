import * as z from "zod";
import { registerUserSchema } from "../validation/user.validator";

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
