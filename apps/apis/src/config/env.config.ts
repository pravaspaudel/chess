import dotenv from "dotenv";
import { envSchema } from "../validation/env.validator";

dotenv.config();

export const config = envSchema.parse(process.env);
