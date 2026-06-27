import type { Request, Response, NextFunction } from "express";
import logger from "./logger";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const date = new Date();

  logger.info(
    `METHOD ${req.method} - ${req.url} at ${date.toLocaleTimeString()}`,
  );

  next();
};

export default requestLogger;
