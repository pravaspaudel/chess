import * as z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number().int().positive(),
  LOG_LEVEL: z.enum([
    "error",
    "warn",
    "info",
    "http",
    "verbose",
    "debug",
    "silly",
  ]),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRY_TIME: z.enum(["15m", "1h", "24h", "7d", "30d"]),

  JWT_ALGORITHM: z.enum(["HS256", "HS384", "HS512", "RS256", "RS384", "RS512"]),
});

export { envSchema };
