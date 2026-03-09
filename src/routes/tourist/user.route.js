import express from "express";
import {
    updateSelectedCity
} from "../../controllers/tourist/user.controller.js";
import { authenticateToken } from "../../middlewares/generalAuth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /tourist/update-selected-city/{city_id}:
 *   put:
 *     summary: Update selected city
 *     tags: [Tourist Common]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: city_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: City ID
 *     responses:
 *       200:
 *         description: Selected city updated successfully
 */
router.put("/update-selected-city/:city_id", authenticateToken, updateSelectedCity);

export default router;