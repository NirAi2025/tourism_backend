import express from 'express';
import {
    users,
    userDetailsById,
    verifyGuideIdentity,
    verifyGuideLicence,
    verifyOverallGuideAccount
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
/**
 * @swagger
 * /admin/users/verify-guide-identity:
 *   post:
 *     summary: Verify guide identity document
 *     tags: [Admin Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [guideId, documentId, status]
 *             properties:
 *               guideId: { type: integer }
 *               documentId: { type: integer }
 *               status: { type: integer, enum: [1, 2] }
 *               remarks: { type: string }
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Document not found
 */
router.post('/users/verify-guide-identity', verifyGuideIdentity);

/**
 * @swagger
 * /admin/users/verify-guide-licence:
 *   post:
 *     summary: Verify guide license document
 *     tags: [Admin Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [guideId, documentId, status]
 *             properties:
 *               guideId: { type: integer }
 *               documentId: { type: integer }
 *               status: { type: integer, enum: [1, 2] }
 *               remarks: { type: string }
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Document not found
 */
router.post('/users/verify-guide-licence', verifyGuideLicence);
/**
 * @swagger
 * /admin/users/verify-overall-guide-account:
 *   post:
 *     summary: Verify overall guide account
 *     tags: [Admin Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [guideId, status]
 *             properties:
 *               guideId: { type: integer }
 *               status: { type: integer, enum: [1, 2] }
 *               remarks: { type: string }
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Guide not found
 */
router.post('/users/verify-overall-guide-account', verifyOverallGuideAccount);



export default router;