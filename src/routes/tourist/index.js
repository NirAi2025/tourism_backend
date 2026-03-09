import { Router } from 'express';
import { authenticateToken } from '../../middlewares/generalAuth.middleware.js';
import tourRoutes from '../tourist/tour.route.js';
import userRoutes from '../tourist/user.route.js';

const router = Router();


router.use("/tours", tourRoutes);
router.use("/", userRoutes);


export default router;