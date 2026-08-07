import type { Request, Response } from "express";
import { LEAGUES } from "../config/leagues.js";

export function listLeagues(_req: Request, res: Response): void {
  res.json({ data: LEAGUES });
}
