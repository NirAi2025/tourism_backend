import express from "express";
import {
  cmsPages,
  getCmsById,
  createOrUpdateCmsPage,
  deleteCmsPage,
} from "../../controllers/admin/cms.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Admin CMS
 *     description: CMS page management
 */

/* ===================== CMS ROUTES ===================== */

/**
 * @swagger
 * /admin/cms:
 *   get:
 *     summary: Get all CMS pages
 *     tags: [Admin CMS]
 *     responses:
 *       200:
 *         description: List of CMS pages
 */
router.get("/cms", cmsPages);

/**
 * @swagger
 * /admin/cms/{id}:
 *   get:
 *     summary: Get CMS page by ID
 *     tags: [Admin CMS]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: CMS page found
 *       404:
 *         description: CMS page not found
 */
router.get("/cms/:id", getCmsById);

/**
 * @swagger
 * /admin/cms:
 *   post:
 *     summary: Create CMS page
 *     tags: [Admin CMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 example: About Us
 *               slug:
 *                 type: string
 *                 example: about-us
 *               content:
 *                 type: string
 *                 example: This is the About Us page content
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: CMS page created
 */
router.post("/cms", createOrUpdateCmsPage);

/**
 * @swagger
 * /admin/cms/{id}:
 *   put:
 *     summary: Update CMS page
 *     tags: [Admin CMS]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               content:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: CMS page updated
 */
router.put("/cms/:id", createOrUpdateCmsPage);

/**
 * @swagger
 * /admin/cms/{id}:
 *   delete:
 *     summary: Delete CMS page
 *     tags: [Admin CMS]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: CMS page deleted
 */
router.delete("/cms/:id", deleteCmsPage);

export default router;
