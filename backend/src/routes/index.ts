import { Router } from 'express';
import healthRoutes from './health.routes.js';
import { languageRoutes } from '../modules/language/index.js';
import { cropRoutes } from '../modules/crop/index.js';
import { diseaseRoutes } from '../modules/disease/index.js';
import { knowledgeRoutes } from '../modules/knowledge/index.js';
import { communityRoutes } from '../modules/community/index.js';
import { marketplaceRoutes } from '../modules/marketplace/index.js';

const rootRouter = Router();

// Mount Public Feature Routers
rootRouter.use('/health', healthRoutes);
rootRouter.use('/languages', languageRoutes);
rootRouter.use('/crops', cropRoutes);
rootRouter.use('/diseases', diseaseRoutes);
rootRouter.use('/knowledge', knowledgeRoutes);
rootRouter.use('/community', communityRoutes);
rootRouter.use('/marketplace', marketplaceRoutes);

export default rootRouter;
