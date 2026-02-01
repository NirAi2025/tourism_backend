import express from "express";

import {
    createTourStepOne
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


export default router;