import { Router } from 'express';
import healthRoutes from './health.routes.js';

const rootRouter = Router();

// Mount Health Check Routes
rootRouter.use('/health', healthRoutes);

export default rootRouter;
