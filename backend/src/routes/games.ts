import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { listLeagueScoreboard, listLiveGames } from "../controllers/gamesController.js";

export const gamesRouter = Router();

gamesRouter.get("/live", asyncHandler(listLiveGames));
gamesRouter.get("/:league", asyncHandler(listLeagueScoreboard));
