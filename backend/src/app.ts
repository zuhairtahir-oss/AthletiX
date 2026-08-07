import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { gamesRouter } from "./routes/games.js";
import { teamsRouter } from "./routes/teams.js";
import { playersRouter } from "./routes/players.js";
import { compareRouter } from "./routes/compare.js";
import { leaguesRouter } from "./routes/leagues.js";
import { standingsRouter } from "./routes/standings.js";
import { searchRouter } from "./routes/search.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.corsOrigins }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/games", gamesRouter);
  app.use("/api/teams", teamsRouter);
  app.use("/api/players", playersRouter);
  app.use("/api/compare", compareRouter);
  app.use("/api/leagues", leaguesRouter);
  app.use("/api/standings", standingsRouter);
  app.use("/api/search", searchRouter);

  app.use((req, res) => {
    res.status(404).json({ error: "Not found", message: `No route for ${req.method} ${req.path}` });
  });

  app.use(errorHandler);

  return app;
}
