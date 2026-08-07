import type { Request, Response } from "express";
import { getTeamById, getTeamRoster, getTeamSchedule, getTeamsByLeague } from "../services/teamsService.js";

export async function listTeams(req: Request, res: Response): Promise<void> {
  const league = typeof req.query.league === "string" ? req.query.league : "";

  if (!league) {
    res.status(400).json({
      error: "Bad request",
      message: "Provide a `league` query, e.g. /api/teams?league=nba",
    });
    return;
  }

  const teams = await getTeamsByLeague(league);
  res.json({ data: teams });
}

export async function getTeam(req: Request, res: Response): Promise<void> {
  const league = String(req.params.league);
  const id = String(req.params.id);

  const team = await getTeamById(league, id);
  if (!team) {
    res.status(404).json({ error: "Not found", message: `No team found with id ${id} in league ${league}.` });
    return;
  }

  const [roster, schedule] = await Promise.all([getTeamRoster(league, id), getTeamSchedule(league, id)]);
  res.json({ data: { ...team, roster, schedule } });
}
