import { Router } from "express";
import authenticateToken from "../../middlewares/adminAuth.middleware.js";
import authorizeRoles from "../../middlewares/adminRole.middleware.js";

import userRoutes from "./user.routes.js";
import cmsRoutes from "./cms.routes.js";
import blogRoutes from "./blog.routes.js";

const router = Router();

router.use(authenticateToken, authorizeRoles("super-admin", "admin"));

router.use("/", userRoutes);
router.use("/", cmsRoutes);
router.use("/", blogRoutes);


export default router;