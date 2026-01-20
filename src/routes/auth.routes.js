import express from "express";
import passport from "passport";

import { 
  login, 
  register, 
  verifyEmail, 
  personalInfo,
  uploadGuideIdentity,
  uploadGuideLicenses
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authenticateToken } from "../middlewares/generalAuth.middleware.js";

import { loginSchema } from "../validations/auth.validation.js";
import { registrationFirstStepSchema } from "../validations/registrationFirstStep.validation.js";
import { registrationSecondStepSchema } from "../validations/registrationSecondStep.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     security: []   # Public route (no JWT)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validate(loginSchema), login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register new user
 *     security: []   # Public route (no JWT)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Registration successful
 *       409:
 *         description: User already exists
 */
router.post("/register", validate(registrationFirstStepSchema), register);
/**
 * @swagger
 * /auth/verify-email/{token}:
 *   get:
 *     tags: [Auth]
 *     summary: Verify email address
 *     security: []   # Public route
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully and token issued
 *       400:
 *         description: Invalid or expired verification token
 */

router.get("/verify-email/:token", verifyEmail);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags: [Auth]
 *     summary: Login with Google
 *     security: []   # Public route
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false, }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Google OAuth callback
 *     security: []   # Public route
 *     responses:
 *       200:
 *         description: Google login successful
 *       401:
 *         description: Authentication failed
 */
router.get("/google/callback",passport.authenticate("google", {session: false,failureRedirect: "/api/auth/google/failure",}),
  (req, res) => {
    const { token, user } = req.user;

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token,
      user,
    });
  }
);

/**
 * @swagger
 * /auth/google/failure:
 *   get:
 *     tags: [Auth]
 *     summary: Google authentication failed
 *     security: []
 */
router.get("/google/failure", (req, res) => {res.status(401).json({success: false,
    message: "Google authentication failed",
  });
});

/**
 * @swagger
 * /auth/personal-info:
 *   post:
 *     tags: [Profile]
 *     summary: Save personal profile information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Rahul
 *               lastName:
 *                 type: string
 *                 example: Sharma
 *               whatsAppNumber:
 *                 type: string
 *                 example: "9876543210"
 *               preferredLanguage:
 *                 type: string
 *                 example: English
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 1995-08-21
 *               nationality:
 *                 type: string
 *                 example: Indian
 *               countryOfOperation:
 *                 type: integer
 *                 example: 91
 *               primaryCity:
 *                 type: integer
 *                 example: 101
 *               yearsOfExperience:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Personal profile information saved successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Validation error
 */

router.post("/personal-info", authenticateToken, validate(registrationSecondStepSchema), personalInfo);
/**
 * @swagger
 * /auth/upload-identity-documents:
 *   post:
 *     tags: [Identity]
 *     summary: Upload identity documents
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - id_number
 *               - government_id
 *               - selfie
 *             properties:
 *               id_number:
 *                 type: string
 *                 example: A123456789
 *               government_id:
 *                 type: string
 *                 format: binary
 *               selfie:
 *                 type: string
 *                 format: binary
 *               address_proof:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Identity documents uploaded successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Validation error
 */
router.post("/upload-identity-documents", authenticateToken, uploadGuideIdentity);

/**
 * @swagger
 * /auth/upload-licence-documents:
 *   post:
 *     tags:
 *       - Guide
 *     summary: Upload guide license documents
 *     description: >
 *       Upload one or more guide license documents.
 *       Each uploaded file key represents the license type.
 *       No text fields are required.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               licensed_tour_guide:
 *                 type: string
 *                 format: binary
 *                 description: Licensed tour guide certificate
 *               tourism_department_id:
 *                 type: string
 *                 format: binary
 *                 description: Tourism department ID document
 *               local_guide_permit:
 *                 type: string
 *                 format: binary
 *                 description: Local guide permit document
 *               special_activity_license:
 *                 type: string
 *                 format: binary
 *                 description: Special activity license document
 *     responses:
 *       200:
 *         description: License documents uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: License documents uploaded successfully
 *                 data:
 *                   type: integer
 *                   example: 4
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: At least one license document is required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post("/upload-licence-documents", authenticateToken, uploadGuideLicenses);

export default router;
