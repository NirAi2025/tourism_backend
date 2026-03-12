import express from 'express';
import {
    allTours,
    tourDetails
} from '../../controllers/admin/tour.controller.js';

const router = express.Router();


/**
 * @swagger
 * /admin/tours:
 *   get:
 *     summary: Get all tours or tours by guide
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: guide_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter tours by guide id
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: Tours fetched successfully
 */
router.get('/tours', allTours);

/**
 * @swagger
 * /admin/tours/{id}:
 *   get:
 *     summary: Get tour details by ID
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tour details fetched successfully
 */
router.get('/tours/:id', tourDetails);

export default router;

