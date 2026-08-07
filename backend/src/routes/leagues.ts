import { Router } from "express";
import { listLeagues } from "../controllers/leaguesController.js";

export const leaguesRouter = Router();

leaguesRouter.get("/", listLeagues);
