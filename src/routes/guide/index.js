import { Router } from 'express';
import { authenticateToken } from '../../middlewares/generalAuth.middleware.js';
import authRoutes from '../guide/auth.route.js';
import tourRoutes from '../guide/tour.route.js';

const router = Router();


router.use("/", authRoutes);
router.use("/tours", tourRoutes);


export default router;