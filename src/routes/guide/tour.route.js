import express from "express";

import {
    createTourStepOne,
    createTourStepTwo,
    createTourStepThree,
    createTourStepFour,
    createTourStepFive,
    createTourStepSix
} from "../../controllers/guide/tour.controller.js";
import { authenticateToken } from "../../middlewares/generalAuth.middleware.js";

const router = express.Router();


/**
 * @swagger
 * /guide/tours/create-tour-step-one:
 *   post:
 *     summary: Create tour (step 1)
 *     tags: [Guide Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, tour_category_id, country_id, city_id]
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               tour_category_id:
 *                 type: integer
 *               country_id:
 *                 type: integer
 *               state_id:
 *                 type: integer
 *               city_id:
 *                 type: integer
 *               place:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["trekking", "adventure"]
 *     responses:
 *       201:
 *         description: Tour created
 *       401:
 *         description: Unauthorized
 */
router.post("/create-tour-step-one", authenticateToken, createTourStepOne);

/**
 * @swagger
 * /guide/tours/create-tour-step-two:
 *   post:
 *     summary: add or update tour (step 2)
 *     tags: [Guide Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tour_id, full_description, what_you_will_do, key_highlights, unique_points]
 *             properties:
 *               tour_id: { type: integer }
 *               full_description: { type: string }
 *               what_you_will_do: { type: string }
 *               key_highlights: { type: string }
 *               unique_points: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Tour not found }
 *       500: { description: Server error }
 */
router.post("/create-tour-step-two", authenticateToken, createTourStepTwo);

/**
 * @swagger
 * /guide/tours/create-tour-step-three:
 *   post:
 *     summary: add or update tour (step 3)
 *     tags: [Guide Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tour_id, itinerary_overview]
 *             properties:
 *               tour_id: { type: integer }
 *               overview: { type: string }
 *               stops:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name: { type: string }
 *                     description: { type: string }
 *                     approx_duration: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Tour not found }
 *       500: { description: Server error }
 */
router.post("/create-tour-step-three", authenticateToken, createTourStepThree);

/**
 * @swagger
 * /guide/tours/create-tour-step-four:
 *   post:
 *     summary: Create or update tour meeting and logistics details (step 4)
 *     tags: [Guide Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tour_id,meeting_point_name,meeting_point_address,meeting_point_latitude,meeting_point_longitude,pickup_offered]
 *             properties:
 *               tour_id: { type: integer }
 *               meeting_point_name: { type: string }
 *               meeting_point_address: { type: string }
 *               meeting_point_latitude: { type: string }
 *               meeting_point_longitude: { type: string }
 *               end_point: { type: string }
 *               pickup_offered: { type: boolean }
 *               pickup_details: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Tour not found }
 *       500: { description: Server error }
 */
router.post("/create-tour-step-four", authenticateToken, createTourStepFour);
/**
 * @swagger
 * /guide/tours/create-tour-step-five:
 *   post:
 *     summary: Create or update tour duration, operating days and availability (step 5)
 *     tags: [Guide Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [
 *               tour_id,
 *               duration,
 *               duration_type,
 *               start_times,
 *               operating_days,
 *               minimum_travelers,
 *               maximum_group_size
 *             ]
 *             properties:
 *               tour_id: { type: integer }
 *               duration: { type: integer }
 *               duration_type:
 *                 type: string
 *                 enum: [HOURS, DAYS, MINUTES]
 *               start_times:
 *                 type: array
 *                 items: { type: string }
 *               operating_days:
 *                 type: array
 *                 description: Weekdays (1=Sunday, 2=Monday, ..., 7=Saturday)
 *                 items: { type: integer }
 *               season_start_date: { type: string, format: date }
 *               season_end_date: { type: string, format: date }
 *               minimum_travelers: { type: integer }
 *               maximum_group_size: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Tour not found }
 *       500: { description: Server error }
 */

router.post("/create-tour-step-five", authenticateToken, createTourStepFive);

/**
 * @swagger
 * /guide/tours/create-tour-step-six:
 *   post:
 *     summary: Create or update tour pricing (step 6)
 *     tags: [Guide Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tour_id, ticket_required]
 *             properties:
 *               tour_id: { type: integer }
 *               ticket_required: { type: boolean }
 *               price: { type: number }
 *               currency: { type: string }
 *               ticket_included: { type: boolean }
 *               adult_price: { type: number }
 *               child_price: { type: number }
 *               infant_price: { type: number }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Tour not found }
 *       500: { description: Server error }
 */
router.post("/create-tour-step-six", authenticateToken, createTourStepSix);


export default router;