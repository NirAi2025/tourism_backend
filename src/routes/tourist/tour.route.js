import express from "express";
import {
    tourAvailability,
    toursBySelectedCity,
    tourDetails,
    topRatedGuides,
    guideDetails
} from "../../controllers/tourist/tour.controller.js";
import { authenticateToken } from "../../middlewares/generalAuth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /tourist/tours/{tour_id}/availability:
 *   get:
 *     summary: Get tour availability and price
 *     tags: [Tourist Tour]
 *     security: []
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
 * /tourist/tours/tours-by-city:
 *   get:
 *     summary: Get tours (optionally filtered by city)
 *     tags: [Tourist Tour]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: city_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Optional city id to filter tours
 *     responses:
 *       200:
 *         description: Tours fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get("/tours-by-city", toursBySelectedCity);

/**
 * @swagger
 * /tourist/tours/tour-details/{tour_id}:
 *   get:
 *     summary: Get tour details by id
 *     tags: [Tourist Tour]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: tour_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tour details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get("/tour-details/:tour_id", tourDetails);

/**
 * @swagger
 * /tourist/tours/top-rated-guides:
 *   get:
 *     summary: Get top-rated guides
 *     tags: [Tourist Tour]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: city_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Optional city id to filter guides by city
 *     responses:
 *       200:
 *         description: Guides fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get("/top-rated-guides", topRatedGuides);

/**
 * @swagger
 * /tourist/tours/guide-details/{guide_id}:
 *   get:
 *     summary: Get guide details by id
 *     tags: [Tourist Tour]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: guide_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Guide details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get("/guide-details/:guide_id", guideDetails);

export default router;