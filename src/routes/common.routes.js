import express from "express";
import {
  getCountryCurrency,
  getAllCountries,
  getStatesByCountry,
  getCitiesByState,
  languages,
} from "../controllers/common.controller.js";

const router = express.Router();

/**
 * @swagger
 * /languages:
 *   get:
 *     summary: Get all languages
 *     tags: [Common]
 *     security: []
 *     responses:
 *       200: { description: Languages list }
 *       500: { description: Server error }
 */
router.get("/languages", languages);
/**
 * @swagger
 * /country-currency:
 *   get:
 *     summary: Get countries with currencies
 *     tags: [Common]
 *     security: []
 *     responses:
 *       200: { description: Countries and currencies list }
 *       500: { description: Server error }
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
 *       200: { description: Countries list }
 *       500: { description: Server error }
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
 *         schema: { type: integer }
 *     responses:
 *       200: { description: States list }
 *       404: { description: Country not found }
 */
router.get("/states/:countryId", getStatesByCountry);
/**
 * @swagger
 * /cities/{stateId}:
 *   get:
 *     summary: Get cities by state ID
 *     tags: [Common]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: stateId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Cities list }
 *       404: { description: Cities not found }
 */
router.get("/cities/:stateId", getCitiesByState);

export default router;
