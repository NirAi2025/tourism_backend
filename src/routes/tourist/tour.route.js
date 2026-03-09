import express from "express";
import {
    tourAvailability,
    toursBySelectedCity
} from "../../controllers/tourist/tour.controller.js";
import { authenticateToken } from "../../middlewares/generalAuth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /tourist/tours/{tour_id}/availability:
 *   get:
 *     summary: Get tour availability and price
 *     tags: [Tourist Tour]
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

/**
 * @swagger
 * /tourist/tours/tours-by-city/{city_id}:
 *   get:
 *     summary: Get tours by selected city
 *     tags: [Tourist Tour]
 *     parameters:
 *       - in: path
 *         name: city_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tours fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: City not found
 */
router.get("/tours-by-city/:city_id", toursBySelectedCity);

export default router;