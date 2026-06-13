import dotenv from "dotenv";

dotenv.config();

function GetEnv(key: string) {
  const val = process.env[key];

  if (!val) {
    throw new Error("env variable doesn't exists");
  }

  return val;
}

function GetNumberEnv(key: string) {
  const val = GetEnv(key);
  const num = Number(val);

  if (Number.isNaN(num)) {
    throw new Error("env variable is not a number");
  }
  return num;
}

export const config = {
  NODE_ENV: GetEnv("NODE_ENV"),
  PORT: GetNumberEnv("PORT"),
  LOG_LEVEL: GetEnv("LOG_LEVEL"),
};
