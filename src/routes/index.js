import { Router } from "express";
import authRoutes from './auth.routes.js';
import adminRoutes from "./admin/index.js";
import guideRoutes from "./guide/index.js";
import commomRoutes from "./common.routes.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/guide', guideRoutes);
router.use('/', commomRoutes);

export default router;
