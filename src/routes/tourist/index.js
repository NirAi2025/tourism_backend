import { Router } from 'express';
import { authenticateToken } from '../../middlewares/generalAuth.middleware.js';
import tourRoutes from '../tourist/tour.route.js';

const router = Router();


router.use("/tours", tourRoutes);


export default router;