import express from "express";
import passport from "passport";

import {
  initialRegistration,
  generalInfo,
  verifyEmail,
  personalInfo,
  uploadGuideIdentity,
  uploadGuideLicenses,
  uploadGuideInsuranceInfo,
  saveGuidePayoutInfo,
  guidePublicInfo,
  guideLanguagesAndSkills,
  myProfile,
  reuploadGuideIdentityDocuments,
  reuploadGuideLicense
} from "../../controllers/guide/auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticateToken } from "../../middlewares/generalAuth.middleware.js";

import { registrationSchema } from "../../validations/registrationFirstStep.validation.js";
import { registrationSecondStepSchema } from "../../validations/registrationSecondStep.validation.js";

const router = express.Router();

/**
 * @swagger
 * /guide/register-initial:
 *   post:
 *     summary: Initial guide registration (Step 1 - Send verification email)
 *     tags: [Guide]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - country_code
 *               - phone
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               country_code:
 *                 type: string
 *                 example: "91"
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password@123"
 *     responses:
 *       200:
 *         description: Verification email sent successfully
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
 *                   example: Verification email sent. Please verify your email.
 *       409:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.post("/register-initial", initialRegistration);

/**
 * @swagger
 * /guide/verify-email/{token}:
 *   get:
 *     tags: [Guide]
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
 * /guide/general-info:
 *   post:
 *     summary: Register a new guide
 *     tags: [Guide]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               whatsAppNumber: { type: string, example: "9876543210" }
 *               languageId: { type: integer, example: 1 }
 *               dob: { type: string, format: date, example: "1995-08-15" }
 *               nationality: { type: integer, example: 101 }
 *               countryOfOperation: { type: integer, example: 101 }
 *               stateId: { type: integer, example: 1111 }
 *               primaryCity: { type: integer, example: 12 }
 *               yearsOfExperience: { type: integer, example: 5 }
 *     responses:
 *       201: { description: Registration successful }
 *       409: { description: User already exists }
 *       500: { description: Server error }
 */
router.post("/general-info", validate(registrationSchema), authenticateToken, generalInfo);

/**
 * @swagger
 * /guide/upload-identity-documents:
 *   post:
 *     summary: Upload guide identity documents
 *     tags: [Guide]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id_number: { type: string, example: "A123456789" }
 *               government_id: { type: string, format: binary }
 *               selfie: { type: string, format: binary }
 *               address_proof: { type: string, format: binary }
 *     responses:
 *       200: { description: Identity documents uploaded successfully }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 */
router.post("/upload-identity-documents",authenticateToken,uploadGuideIdentity);


/**
 * @swagger
 * /guide/upload-licence-documents:
 *   post:
 *     summary: Upload guide license documents
 *     tags: [Guide]
 *     description: Upload one or more guide license documents (file-only request).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               licensed_tour_guide: { type: string, format: binary }
 *               tourism_department_id: { type: string, format: binary }
 *               local_guide_permit: { type: string, format: binary }
 *               special_activity_license: { type: string, format: binary }
 *     responses:
 *       200: { description: License documents uploaded successfully }
 *       400: { description: At least one license document is required }
 *       401: { description: Unauthorized }
 *       500: { description: Server error }
 */
router.post("/upload-licence-documents",authenticateToken,uploadGuideLicenses);

/**
 * @swagger
 * /guide/upload-insurance-info:
 *   post:
 *     summary: Upload guide insurance & emergency contact info
 *     tags: [Guide]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [emergency_contact_name, emergency_contact_phone]
 *             properties:
 *               insurance_provider: { type: string, example: "LIC India" }
 *               policy_number: { type: string, example: "POL123456" }
 *               policy_expiry_date: { type: string, format: date, example: "2026-12-31" }
 *               insurance_document: { type: string, format: binary }
 *               emergency_contact_name: { type: string, example: "Rahul Sharma" }
 *               emergency_contact_phone: { type: string, example: "9876543210" }
 *               emergency_contact_relation: { type: string, example: "Brother" }
 *     responses:
 *       200: { description: Insurance information saved successfully }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 *       500: { description: Server error }
 */
router.post("/upload-insurance-info",authenticateToken,uploadGuideInsuranceInfo);

/**
 * @swagger
 * /guide/languages-skills:
 *   post:
 *     summary: Save guide languages & skills
 *     tags: [Guide]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [language_ids, primary_language_id]
 *             properties:
 *               language_ids:
 *                 type: array
 *                 items: { type: integer }
 *                 example: [1, 2, 3]
 *               primary_language_id: { type: integer, example: 1 }
 *               certification_type:
 *                 type: string
 *                 enum: [first_aid, safety_training, other]
 *                 example: first_aid
 *               certification_document: { type: string, format: binary }
 *     responses:
 *       200: { description: Languages and skills saved successfully }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 *       500: { description: Server error }
 */
router.post("/languages-skills", authenticateToken, guideLanguagesAndSkills);
/**
 * @swagger
 * /guide/payout-info:
 *   post:
 *     summary: Create or update guide payout info
 *     tags: [Guide]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               [account_holder_name, bank_name, account_number, payout_currency, payout_method, tax_residency_country_id, tax_id]
 *             properties:
 *               account_holder_name: { type: string, example: "Rahul Sharma" }
 *               bank_name: { type: string, example: "HDFC Bank" }
 *               account_number: { type: string, example: "123456789012" }
 *               ifsc_swift_bic: { type: string, example: "HDFC0001234" }
 *               payout_currency: { type: string, example: "INR" }
 *               payout_method: { type: string, example: "BANK_TRANSFER" }
 *               tax_residency_country_id: { type: integer, example: 101 }
 *               tax_id: { type: string, example: "ABCDE1234F" }
 *     responses:
 *       200: { description: Payout information saved successfully }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 *       500: { description: Server error }
 */
router.post("/payout-info", authenticateToken, saveGuidePayoutInfo);
/**
 * @swagger
 * /guide/public-info:
 *   post:
 *     summary: Save guide public profile info
 *     tags: [Guide]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [bio, profile_photo]
 *             properties:
 *               bio:
 *                 type: string
 *                 example: "Certified local guide with 5+ years of experience."
 *               profile_photo: { type: string, format: binary }
 *               external_review_links:
 *                 type: string
 *                 example: "https://www.tripadvisor.com/Profile/guide123"
 *               social_media_url:
 *                 type: string
 *                 example: "https://www.instagram.com/guideprofile"
 *     responses:
 *       200: { description: Profile information saved successfully }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 *       500: { description: Server error }
 */
router.post("/public-info", authenticateToken, guidePublicInfo);
/**
 * @swagger
 * /guide/identity/reupload:
 *   put:
 *     summary: Reupload guide identity documents
 *     tags: [Guide]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               government_document_id:
 *                 type: integer
 *                 example: 12
 *               government_id:
 *                 type: string
 *                 format: binary
 *               selfie_document_id:
 *                 type: integer
 *                 example: 15
 *               selfie:
 *                 type: string
 *                 format: binary
 *               address_proof_document_id:
 *                 type: integer
 *                 example: 18
 *               address_proof:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Documents reuploaded successfully
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
 *                   example: Document(s) reuploaded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

router.put("/identity/reupload",authenticateToken,reuploadGuideIdentityDocuments);
/**
 * @swagger
 * /guide/license/reupload:
 *   put:
 *     summary: Reupload guide license document
 *     description: Reupload an existing license document by providing its document ID, license type and new file. Verification status will be reset to pending.
 *     tags: [Guide]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - license_document_id
 *               - license_type
 *               - license_file
 *             properties:
 *               license_document_id:
 *                 type: integer
 *                 example: 25
 *                 description: Existing license document ID
 *               license_type:
 *                 type: integer
 *                 example: 1
 *                 description: Type of the license (must match existing record)
 *               license_file:
 *                 type: string
 *                 format: binary
 *                 description: New license document file
 *     responses:
 *       200:
 *         description: License document reuploaded successfully
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
 *                   example: License document reuploaded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 *       404:
 *         description: Document not found
 *       500:
 *         description: Internal server error
 */

router.put("/license/reupload",authenticateToken,reuploadGuideLicense);
/**
 * @swagger
 * /guide/my-profile:
 *   get:
 *     summary: Get guide profile details
 *     tags: [Guide]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: 
 *         description: Guide profile fetched successfully
 *       401: 
 *         description: Unauthorized
 *       500: 
 *         description: Server error
 */
router.get("/my-profile", authenticateToken, myProfile);


export default router;
