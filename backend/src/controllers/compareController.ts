import type { Request, Response } from "express";
import { comparePlayers, compareTeams } from "../services/compareService.js";

interface ParsedComparisonQuery {
  leagueA: string;
  idA: string;
  leagueB: string;
  idB: string;
}

function parseQuery(req: Request): ParsedComparisonQuery | null {
  const leagueA = typeof req.query.leagueA === "string" ? req.query.leagueA : "";
  const idA = typeof req.query.a === "string" ? req.query.a : "";
  const leagueB = typeof req.query.leagueB === "string" ? req.query.leagueB : "";
  const idB = typeof req.query.b === "string" ? req.query.b : "";

  if (!leagueA || !idA || !leagueB || !idB) return null;
  return { leagueA, idA, leagueB, idB };
}

export async function comparePlayersHandler(req: Request, res: Response): Promise<void> {
  const query = parseQuery(req);
  if (!query) {
    res.status(400).json({
      error: "Bad request",
      message: "Provide `leagueA`, `a`, `leagueB`, and `b` query params.",
    });
    return;
  }

  const comparison = await comparePlayers(query.leagueA, query.idA, query.leagueB, query.idB);
  res.json({ data: comparison });
}

export async function compareTeamsHandler(req: Request, res: Response): Promise<void> {
  const query = parseQuery(req);
  if (!query) {
    res.status(400).json({
      error: "Bad request",
      message: "Provide `leagueA`, `a`, `leagueB`, and `b` query params.",
    });
    return;
  }

  const comparison = await compareTeams(query.leagueA, query.idA, query.leagueB, query.idB);
  res.json({ data: comparison });
}
