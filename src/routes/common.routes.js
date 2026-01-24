import express from "express";
import {
  getCountryCurrency,
  getAllCountries,
  getStatesByCountry,
  getCitiesByState,
} from "../controllers/common.controller.js";

const router = express.Router();

/**
 * @swagger
 * /country-currency:
 *   get:
 *     summary: Get all countries with their currencies
 *     tags: [Common]
 *     security: []
 *     responses:
 *       200:
 *         description: List of countries and their currencies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: India
 *                   currency:
 *                     type: string
 *                     example: INR
 *       500:
 *         description: Server error
 */
router.get("/country-currency", getCountryCurrency);

/**
 * @swagger
 * /countries:
 *   get:
 *     summary: Get all countries
 *     tags: [Common]
 *     security: []
 *     responses:
 *       200:
 *         description: List of countries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: India
 *       500:
 *         description: Server error
 */
router.get("/countries", getAllCountries);
/**
 * @swagger
 * /states/{countryId}:
 *   get:
 *     summary: Get states by country ID
 *     tags: [Common]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: countryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Country ID
 *     responses:
 *       200:
 *         description: List of states
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 10
 *                   name:
 *                     type: string
 *                     example: Karnataka
 *       404:
 *         description: Country not found
 */
router.get("/states/:countryId", getStatesByCountry);
/**
 * @swagger
 * /cities/{stateId}:
 *   get:
 *     summary: Get cities by state ID
 *     tags: [Common]
 *      security: []
 *     parameters:
 *       - in: path
 *         name: stateId
 *         required: true
 *         schema:
 *           type: integer
 *         description: State ID
 *     responses:
 *       200:
 *         description: List of cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 101
 *                   name:
 *                     type: string
 *                     example: Bengaluru
 *       404:
 *         description: State not found
 */
router.get("/cities/:stateId", getCitiesByState);

export default router;
