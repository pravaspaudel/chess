import * as z from "zod";

export const registerUserSchema = z.object({
  username: z.string().min(1, "username is required"),
  email: z.email().transform((email) => email.toLowerCase()),
  password: z.string().min(6, "password should be at least 6 characters long"),
});

export const loginUserSchema = z.object({
  email: z.email().transform((email) => email.toLowerCase()),
  password: z.string().min(6, "password should be at least 6 characters"),
});
