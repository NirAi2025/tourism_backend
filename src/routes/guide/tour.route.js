import express from "express";

import {
    createTourStepOne,
    createTourStepTwo,
    createTourStepThree,
    createTourStepFour,
    createTourStepFive,
    createTourStepSix,
    createTourStepSeven,
    createTourStepEight,
    createTourStepNine,
    createTourStepTen,
    createTourStepEleven
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

/**
 * @swagger
 * /guide/tours/create-tour-step-seven:
 *   post:
 *     summary: Add inclusions, exclusions and restrictions
 *     tags: [Guide Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tour_id
 *               - included
 *               - excluded
 *               - difficulty_level
 *             properties:
 *               tour_id:
 *                 type: integer
 *                 example: 12
 *               included:
 *                 type: string
 *                 example: "Guide, Equipment"
 *               excluded:
 *                 type: string
 *                 example: "Food, Drinks"
 *               difficulty_level:
 *                 type: string
 *                 enum: [EASY, MODERATE, HARD]
 *               optional_addons:
 *                 type: string
 *                 example: "Photos, Hotel pickup"
 *               skip_the_line_access:
 *                 type: boolean
 *                 example: true
 *               age_min:
 *                 type: integer
 *                 example: 12
 *               age_max:
 *                 type: integer
 *                 example: 60
 *               accessibility_options:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum:
 *                     - WHEEL_CHAIR
 *                     - STROLLER
 *                     - DISABILITY_ACCESSIBLE
 *                     - NONE
 *                     - ALL
 *                     - OTHER
 *                 example: ["WHEEL_CHAIR", "STROLLER"]
 *               not_suitable_for:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum:
 *                     - SMOKERS
 *                     - HEART_CONDITION
 *                     - PREGNANT
 *                     - BACK_PROBLEM
 *                     - ASTHMA
 *                     - OTHER
 *                 example: ["PREGNANT", "HEART_CONDITION"]
 *     responses:
 *       200:
 *         description: Inclusions and restrictions saved successfully
 *       404:
 *         description: Tour not found
 *       500:
 *         description: Server error
 */

router.post("/create-tour-step-seven", authenticateToken, createTourStepSeven);

/**
 * @swagger
 * /guide/tours/create-tour-step-eight:
 *   post:
 *     tags: [Guide Tours]
 *     summary: Tour Step 8 - Languages & Safety Declarations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tour_id
 *               - language_ids
 *               - is_live_guide
 *               - safety_instructions
 *               - permit_declared
 *               - insurance_declared
 *             properties:
 *               tour_id:
 *                 type: integer
 *                 example: 101
 *               language_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *               is_live_guide:
 *                 type: boolean
 *                 example: true
 *               safety_instructions:
 *                 type: string
 *                 example: Follow guide instructions at all times
 *               fitness_requirements:
 *                 type: string
 *                 example: Moderate fitness required
 *               permit_declared:
 *                 type: boolean
 *                 example: true
 *               insurance_declared:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Languages and safety details saved successfully
 *       404:
 *         description: Tour not found
 *       500:
 *         description: Internal server error
 */

router.post("/create-tour-step-eight", authenticateToken, createTourStepEight);

/**
 * @swagger
 * /guide/tours/create-tour-step-nine:
 *   post:
 *     tags: [Guide Tours]
 *     security:
 *       - bearerAuth: []
 *     summary: Tour Step 9 - Media & Assets
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - tour_id
 *               - cover_image
 *               - image_rights_confirmation
 *             properties:
 *               tour_id:
 *                 type: integer
 *                 example: 101
 *               cover_image:
 *                 type: string
 *                 format: binary
 *               gallery_images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               video_url:
 *                 type: string
 *                 example: https://youtube.com/watch?v=xxxx
 *               image_rights_confirmation:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Media saved successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Tour not found
 */
router.post("/create-tour-step-nine", authenticateToken, createTourStepNine);

/**
 * @swagger
 * /guide/tours/create-tour-step-ten:
 *   post:
 *     tags: [Guide Tours]
 *     summary: Tour Policies & Customer Preparation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tour_id
 *               - cancellation_policy
 *               - cancellation_cutoff
 *               - what_to_bring
 *             properties:
 *               tour_id:
 *                 type: integer
 *                 example: 101
 *               cancellation_policy:
 *                 type: string
 *                 enum: [FREE, PARTIAL, NONE]
 *               cancellation_cutoff:
 *                 type: string
 *                 enum: [24_HOURS, 48_HOURS, 72_HOURS, 7_DAYS]
 *               no_show_policy:
 *                 type: string
 *                 example: No refund for no-shows
 *               weather_policy:
 *                 type: string
 *                 example: Tour may be cancelled due to bad weather
 *               refund_policy:
 *                 type: string
 *                 example: Refund within 5 working days
 *               reschedule_policy:
 *                 type: string
 *                 example: One free reschedule allowed
 *               what_to_bring:
 *                 type: string
 *                 example: Shoes, ID proof, water bottle
 *               dress_code:
 *                 type: string
 *                 example: Casual
 *               important_notes:
 *                 type: string
 *                 example: Reach 15 minutes early
 *     responses:
 *       200:
 *         description: Policies and preparation saved successfully
 *       404:
 *         description: Tour not found
 */
router.post("/create-tour-step-ten", authenticateToken, createTourStepTen);

/**
 * @swagger
 *  /guide/tours/create-tour-step-eleven:
 *   post:
 *     tags: [Guide Tours]
 *     summary: Tour Step 11 - SEO & Internal Metadata
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tour_id
 *             properties:
 *               tour_id:
 *                 type: integer
 *                 example: 101
 *               seo_title:
 *                 type: string
 *                 example: Best Goa Scuba Diving Tour
 *               seo_description:
 *                 type: string
 *                 example: Meta description for search engines
 *               search_tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["goa", "scuba", "adventure"]
 *     responses:
 *       200:
 *         description: SEO & internal metadata saved successfully
 *       404:
 *         description: Tour not found
 *       500:
 *         description: Internal server error
 */
router.post("/create-tour-step-eleven", authenticateToken, createTourStepEleven);

export default router;