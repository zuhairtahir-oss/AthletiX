import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getLeagueStandings } from "../controllers/standingsController.js";

export const standingsRouter = Router();

standingsRouter.get("/:league", asyncHandler(getLeagueStandings));
