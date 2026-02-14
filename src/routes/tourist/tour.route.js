import express from "express";
import {
    tourAvailability
} from "../../controllers/tourist/tour.controller.js";
import { authenticateToken } from "../../middlewares/generalAuth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /tourist/tours/{tour_id}/availability:
 *   get:
 *     summary: Get tour availability and price
 *     tags: [User Tour]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tour_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Availability fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Tour not found
 */
router.get("/:tour_id/availability", authenticateToken, tourAvailability);

export default router;