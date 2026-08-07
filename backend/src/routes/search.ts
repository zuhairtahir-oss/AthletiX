import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { searchHandler } from "../controllers/searchController.js";

export const searchRouter = Router();

searchRouter.get("/", asyncHandler(searchHandler));
