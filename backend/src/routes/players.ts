import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getPlayer, getPlayerStatsHandler } from "../controllers/playersController.js";

export const playersRouter = Router();

playersRouter.get("/:league/:id/stats", asyncHandler(getPlayerStatsHandler));
playersRouter.get("/:league/:id", asyncHandler(getPlayer));
