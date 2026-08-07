import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { comparePlayersHandler, compareTeamsHandler } from "../controllers/compareController.js";

export const compareRouter = Router();

compareRouter.get("/players", asyncHandler(comparePlayersHandler));
compareRouter.get("/teams", asyncHandler(compareTeamsHandler));
