import type { Request, Response } from "express";
import { getPlayerById } from "../services/playersService.js";
import { getPlayerStats } from "../services/playerStatsService.js";

export async function getPlayer(req: Request, res: Response): Promise<void> {
  const league = String(req.params.league);
  const id = String(req.params.id);

  const player = await getPlayerById(league, id);
  if (!player) {
    res.status(404).json({ error: "Not found", message: `No player found with id ${id} in league ${league}.` });
    return;
  }

  res.json({ data: player });
}

export async function getPlayerStatsHandler(req: Request, res: Response): Promise<void> {
  const league = String(req.params.league);
  const id = String(req.params.id);

  const result = await getPlayerStats(league, id);
  if (!result) {
    res.status(404).json({ error: "Not found", message: `Unsupported league: ${league}.` });
    return;
  }

  res.json({ data: result });
}
