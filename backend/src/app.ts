import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env.js';
import { httpLogger } from './middleware/logger.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import apiRouter from './routes/index.js';

// Initialize Express Application
const app: Application = express();

// 1. Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 2. Body Parsing & Compression
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// 3. HTTP Request Logging
app.use(httpLogger);

// 4. API Routes (/api/v1)
app.use('/api/v1', apiRouter);

// 5. Root Status Route
app.get('/', (_req, res) => {
  res.json({
    message: 'LeafCare Multilingual Agricultural Advisory API',
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 6. 404 Catch-all Handler
app.use(notFoundHandler);

// 7. Global Error Handling Middleware
app.use(errorHandler);

export default app;
