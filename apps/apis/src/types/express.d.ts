import "express";
import type { Request } from "express";
import type { User } from "./user.type";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
