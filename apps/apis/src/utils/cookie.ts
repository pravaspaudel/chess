import jwt from "jsonwebtoken";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { config } from "../config/env.config";
import { AppError } from "../errors/errors";
import type { Response, Request } from "express";

export type JWTPayload = {
  id: string;
};

function generateToken(payload: JWTPayload) {
  const token = jwt.sign({ id: payload.id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRY_TIME,
    algorithm: config.JWT_ALGORITHM,
  });

  return token;
}

function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET, {
      algorithms: [config.JWT_ALGORITHM],
    });

    if (decoded == null || typeof decoded !== "object") {
      throw new Error("invalid payload");
    }

    return {
      id: String(decoded.id),
    };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AppError(401, "token expired");
    }

    if (error instanceof JsonWebTokenError) {
      throw new AppError(401, "invalid token");
    }

    throw error;
  }
}

function createCookie(res: Response, key: string, val: string) {
  res.cookie(key, val, {
    httpOnly: true,
    secure: config.NODE_ENV == "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
}

function getCookie(req: Request, key: string): string {
  const token = req.cookies[key];

  if (!token) {
    throw new Error("no such token exists");
  }

  return token;
}

export { generateToken, verifyToken, createCookie, getCookie };
