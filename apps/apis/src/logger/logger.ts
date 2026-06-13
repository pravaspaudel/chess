import winston, { exitOnError } from "winston";
import { config } from "../config/env.config";
import path from "path";

const logDirectory = path.resolve(process.cwd(), "logs");

const logger = winston.createLogger({
  level: config.LOG_LEVEL || "info",

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),

  defaultMeta: { service: "user-service" },

  transports: [
    new winston.transports.File({
      filename: path.join(logDirectory, "combined.log"),
    }),

    new winston.transports.File({
      filename: path.join(logDirectory, "error.log"),
    }),
  ],
  exitOnError: false,
});

if (config.NODE_ENV != "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(
          ({ timestamp, level, message, stack }) =>
            `${timestamp} ${level}: ${stack || message}`,
        ),
      ),
    }),
  );
}

export default logger;
