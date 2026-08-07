import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Wraps an async route handler so rejected promises are forwarded to
 * Express's error middleware instead of crashing the process or
 * hanging the request. Every controller uses this — no controller
 * should ever have a bare try/catch that swallows errors.
 */
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}
