import type { Request, Response } from "express";
import { getAllLiveGames, getLeagueScoreboard } from "../services/gamesService.js";

export async function listLiveGames(_req: Request, res: Response): Promise<void> {
  const games = await getAllLiveGames();
  res.json({ data: games });
}

export async function listLeagueScoreboard(req: Request, res: Response): Promise<void> {
  const league = String(req.params.league);
  const games = await getLeagueScoreboard(league);
  res.json({ data: games });
}
