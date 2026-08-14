import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error.js';
import { sendError } from '../utils/api-response.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

/**
 * Global Express Error Handling Middleware
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: unknown = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.errors;
  } else if (err.name === 'SyntaxError') {
    statusCode = 400;
    message = 'Invalid JSON payload received';
  } else {
    logger.error(`[Unhandled Exception] ${err.message}`, { stack: err.stack });
  }

  const stack = env.NODE_ENV === 'development' ? err.stack : undefined;

  return sendError({
    res,
    statusCode,
    message,
    errors: details,
    stack,
  });
};

/**
 * 404 Route Not Found Middleware
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404);
  next(error);
};
