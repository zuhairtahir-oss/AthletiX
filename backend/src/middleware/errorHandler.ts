import type { ErrorRequestHandler } from "express";
import { UpstreamApiError } from "../services/espnClient.js";

/**
 * Centralized error handler — the single place that decides what error
 * shape the API returns. Keeps upstream/internal error details out of
 * client responses while still logging the real cause server-side.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err instanceof UpstreamApiError) {
    res.status(err.status >= 400 && err.status < 600 ? err.status : 502).json({
      error: "Upstream sports data provider error",
      message: "The sports data provider is temporarily unavailable. Please try again shortly.",
    });
    return;
  }

  const message = err instanceof Error ? err.message : "Unexpected error";
  res.status(500).json({ error: "Internal server error", message });
};
