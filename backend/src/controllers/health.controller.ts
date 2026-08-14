import { Request, Response } from 'express';
import { sendSuccess } from '../utils/api-response.js';
import { env } from '../config/env.js';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';

/**
 * Enhanced Health Diagnostic Check Handler
 * GET /api/v1/health
 */
export const checkHealth = async (_req: Request, res: Response): Promise<Response> => {
  let dbStatus = 'disconnected';
  let dbLatencyMs = 0;

  // Execute live DB Ping test (SELECT 1)
  const startTime = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - startTime;
    dbStatus = 'connected';
  } catch (error) {
    dbLatencyMs = Date.now() - startTime;
    logger.error('❌ Health check DB Ping failed:', error);
  }

  const isHealthy = dbStatus === 'connected';

  const healthData = {
    status: isHealthy ? 'healthy' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
      engine: 'PostgreSQL 16',
      modelsConfigured: 25,
    },
    memoryUsage: process.memoryUsage(),
  };

  return sendSuccess({
    res,
    statusCode: isHealthy ? 200 : 503,
    message: isHealthy
      ? 'LeafCare API and PostgreSQL Database are operational'
      : 'LeafCare API running in degraded state (Database disconnected)',
    data: healthData,
  });
};
