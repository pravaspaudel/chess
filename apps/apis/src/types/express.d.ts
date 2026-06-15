import "express";
import type { JWTPayload } from "../utils/cookie";
import type { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
