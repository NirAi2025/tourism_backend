import express from "express";
import {
  getAllBlogTypes,
  getBlogTypeById,
  createOrUpdateBlogType,
  deleteBlogType,
  getAllBlogs,
  getBlogByIdOrSlug,
  createOrUpdateBlog,
  deleteBlog,
} from "../../controllers/admin/blog.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Admin Blog Types
 *     description: Blog type management
 *   - name: Admin Blogs
 *     description: Blog management
 */

/* ===================== BLOG TYPE ROUTES ===================== */

/**
 * @swagger
 * /admin/blog-types:
 *   get:
 *     summary: Get all blog types
 *     tags: [Admin Blog Types]
 *     responses:
 *       200:
 *         description: List of blog types
 */
router.get("/blog-types", getAllBlogTypes);

/**
 * @swagger
 * /admin/blog-types/{id}:
 *   get:
 *     summary: Get blog type by ID
 *     tags: [Admin Blog Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Blog type found
 *       404:
 *         description: Blog type not found
 */
router.get("/blog-types/:id", getBlogTypeById);

/**
 * @swagger
 * /admin/blog-types:
 *   post:
 *     summary: Create blog type
 *     tags: [Admin Blog Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Travel
 *     responses:
 *       200:
 *         description: Blog type created
 */
router.post("/blog-types", createOrUpdateBlogType);

/**
 * @swagger
 * /admin/blog-types/{id}:
 *   put:
 *     summary: Update blog type
 *     tags: [Admin Blog Types]
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
 *               name:
 *                 type: string
 *                 example: Adventure
 *     responses:
 *       200:
 *         description: Blog type updated
 */
router.put("/blog-types/:id", createOrUpdateBlogType);

/**
 * @swagger
 * /admin/blog-types/{id}:
 *   delete:
 *     summary: Delete blog type
 *     tags: [Admin Blog Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Blog type deleted
 */
router.delete("/blog-types/:id", deleteBlogType);

/* ===================== BLOG ROUTES ===================== */

/**
 * @swagger
 * /admin/blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Admin Blogs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of blogs
 */
router.get("/blogs", getAllBlogs);

/**
 * @swagger
 * /admin/blogs/{identifier}:
 *   get:
 *     summary: Get blog by ID or slug
 *     tags: [Admin Blogs]
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID or slug
 *     responses:
 *       200:
 *         description: Blog found
 *       404:
 *         description: Blog not found
 */
router.get("/blogs/:identifier", getBlogByIdOrSlug);

/**
 * @swagger
 * /admin/blogs:
 *   post:
 *     summary: Create blog
 *     tags: [Admin Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               blog_type_id:
 *                 type: integer
 *               featured_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Blog created
 */
router.post("/blogs", createOrUpdateBlog);

/**
 * @swagger
 * /admin/blogs/{id}:
 *   put:
 *     summary: Update blog
 *     tags: [Admin Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               blog_type_id:
 *                 type: integer
 *               featured_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Blog updated
 */
router.put("/blogs/:id", createOrUpdateBlog);

/**
 * @swagger
 * /admin/blogs/{id}:
 *   delete:
 *     summary: Delete blog
 *     tags: [Admin Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Blog deleted
 */
router.delete("/blogs/:id", deleteBlog);

export default router;
