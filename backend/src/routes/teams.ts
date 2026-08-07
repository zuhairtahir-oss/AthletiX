import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getTeam, listTeams } from "../controllers/teamsController.js";

export const teamsRouter = Router();

teamsRouter.get("/", asyncHandler(listTeams));
teamsRouter.get("/:league/:id", asyncHandler(getTeam));
