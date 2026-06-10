import express from "express";
import type { Request, Response } from "express";
import { testChessJS } from "@repo/chess-utils";
import { ENV } from "./config/env.config";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "this is / route",
  });
});

// testkhessJS();

app.listen(ENV.PORT, () => {
  console.log(`server is running on http://localhost:${ENV.PORT}`);
});
