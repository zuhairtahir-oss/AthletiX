import type { Request, Response } from "express";
import { getStandings } from "../services/standingsService.js";

export async function getLeagueStandings(req: Request, res: Response): Promise<void> {
  const league = String(req.params.league);
  const standings = await getStandings(league);
  res.json({ data: standings });
}
