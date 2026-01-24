import { Router } from 'express';
import { authenticateToken } from '../../middlewares/generalAuth.middleware.js';
import authRoutes from '../guide/auth.route.js';

const router = Router();

router.use("/", authRoutes);

export default router;