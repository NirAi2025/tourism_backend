import express from 'express';
import {
    users,
    userDetailsById
} from '../../controllers/admin/user.controller.js';

const router = express.Router();

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get users
 *     tags: [Admin Users]
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema: { type: integer, enum: [1, 2] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/users', users);
/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Admin Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User not found
 */
router.get('/users/:id', userDetailsById);


export default router;