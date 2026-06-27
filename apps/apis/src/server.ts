import app from "./app";
import { config } from "./config/env.config";
import logger from "./logger/logger";
import { startRedis } from "@repo/redis";

startRedis();

app.listen(config.PORT, () => {
  logger.info(`app is running on http://localhost:${config.PORT}`);
});
