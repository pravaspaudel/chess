//protected routes goes in here
import type { Request, Response, NextFunction } from "express";
import { createCookie, getCookie, verifyToken } from "../utils/cookie";

const protectedRoute = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getCookie(req, "token");

    const payload = verifyToken(token);

    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
};

export default protectedRoute;
