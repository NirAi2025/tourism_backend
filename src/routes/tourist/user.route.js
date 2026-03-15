import express from "express";
import {
    updateSelectedCity,
    addOrUpdateOrDeleteWishlist,
    toggleWishlist
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

/**
 * @swagger
 * /tourist/manage-wishlist:
 *   post:
 *     summary: Create, update or delete wishlist
 *     tags: [Tourist Common]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               wishlist_id:
 *                 type: integer
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Operation successful
 */
router.post("/manage-wishlist", authenticateToken, addOrUpdateOrDeleteWishlist);

/**
 * @swagger
 * /tourist/toggle-wishlist/{tour_id}:
 *   post:
 *     summary: Toggle wishlist for a tour
 *     tags: [Tourist Common]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tour_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               wishlist_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Wishlist updated
 */
router.post("/toggle-wishlist/:tour_id", authenticateToken, toggleWishlist);

export default router;