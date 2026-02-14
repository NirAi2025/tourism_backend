import { Router } from "express";
import authRoutes from './auth.routes.js';
import adminRoutes from "./admin/index.js";
import guideRoutes from "./guide/index.js";
import commomRoutes from "./common.routes.js";
import touristRoutes from "./tourist/index.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/guide', guideRoutes);
// router.use('/tourist', touristRoutes);
router.use('/', commomRoutes);

export default router;
