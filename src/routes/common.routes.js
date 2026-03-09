import express from "express";
import {
  getCountryCurrency,
  getAllCountries,
  getStatesByCountry,
  getCitiesByState,
  languages,
  tourCategories,
  getCitiesByCountry,
  changeCityIconicStatus,
  updateCityIconicImage,
  iconicDestinationsWorldwide,
  addCity
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

/**
 * @swagger
 * /tour-categories:
 *   get:
 *     summary: Get tour categories
 *     tags: [Common]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema: { type: integer }
 *       - in: query
 *         name: filter
 *         schema: { type: string }
 *     responses:
 *       200: { description: Tour categories list }
 *       404: { description: Category not found }
 */
router.get("/tour-categories", tourCategories);
/**
 * @swagger
 * /cities-by-country/{countryId}:
 *   get:
 *     summary: Get cities by country ID
 *     tags: [Common]
 *     parameters:
 *       - in: path
 *         name: countryId
 *         required: true
 *         schema:
 *           type: integer
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *
 *     responses:
 *       200:
 *         description: Cities fetched successfully
 *       400:
 *         description: Invalid request
 */
router.get("/cities-by-country/:countryId", getCitiesByCountry);

/**
 * @swagger
 * /change-city-iconic-status/{cityId}:
 *   get:
 *     summary: Toggle iconic status of a city
 *     tags: [Common]
 *     parameters:
 *       - in: path
 *         name: cityId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: City iconic status updated successfully
 *       400:
 *         description: Invalid request
 */
router.get("/change-city-iconic-status/:cityId", changeCityIconicStatus);

/**
 * @swagger
 * /update-city-iconic-image/{cityId}:
 *   put:
 *     summary: Update iconic image of a city
 *     tags: [Common]
 *     parameters:
 *       - in: path
 *         name: cityId
 *         required: true
 *         schema:
 *           type: integer
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *             required:
 *               - image
 *
 *     responses:
 *       200:
 *         description: City iconic image updated successfully
 *       400:
 *         description: Invalid request
 */

router.put("/update-city-iconic-image/:cityId", updateCityIconicImage);

/**
 * @swagger
 * /add-city:
 *   post:
 *     summary: Add a new city
 *     tags: [Common]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               country_id:
 *                 type: integer
 *             required:
 *               - name
 *
 *     responses:
 *       200:
 *         description: City added successfully
 *       400:
 *         description: Invalid request
 */
router.post("/add-city", addCity);

/**
 * @swagger
 * /iconic-destinations-worldwide:
 *   get:
 *     summary: Get iconic destinations worldwide
 *     tags: [Common]
 *     security: []
 *     responses:
 *       200: { description: Iconic destinations list }
 *       500: { description: Server error }
 */
router.get("/iconic-destinations-worldwide", iconicDestinationsWorldwide);



export default router;
