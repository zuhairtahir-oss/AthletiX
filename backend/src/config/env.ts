import "dotenv/config";

/**
 * Centralized environment configuration. Every other module imports
 * from here instead of reading process.env directly.
 *
 * ESPN's public JSON endpoints require no API key at all, so there is
 * nothing sport-data-related to configure here beyond server basics.
 */
export const env = {
  port: Number(process.env.PORT) || 4000,
  corsOrigins: (process.env.CORS_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
