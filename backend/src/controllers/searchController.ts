import type { Request, Response } from "express";
import { search } from "../services/searchService.js";

export async function searchHandler(req: Request, res: Response): Promise<void> {
  const query = typeof req.query.q === "string" ? req.query.q : "";

  if (!query) {
    res.status(400).json({
      error: "Bad request",
      message: "Provide a `q` query, e.g. /api/search?q=Messi",
    });
    return;
  }

  const results = await search(query);
  res.json({ data: results });
}
