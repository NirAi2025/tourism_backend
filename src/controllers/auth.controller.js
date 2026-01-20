import { StatusCodes } from "http-status-codes";
import constants from "../config/constants.js";
import {
  loginService,
  registrationService,
  verifyEmailService,
  personalProfileInfoService,
  createGuideIdentityService,
  createGuideLicenseService
} from "../services/auth.service.js";
import { fileUploaderSingle } from "../utils/fileUpload.js";
import {
  IDENTITY_DOC_UPLOAD_PATH,
  GUIDE_LICENCE_UPLOAD_PATH,
} from "../config/fileUploadPath.js";

export const login = async (req, res) => {
  try {
    const data = await loginService(req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

export const register = async (req, res) => {
  try {
    const result = await registrationService(req.body);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message:
        result?.message || "Registration successful. Please verify your email.",
      data: result || null,
    });
  } catch (error) {
    const statusCode = error.statusCode || StatusCodes.BAD_REQUEST;

    if (statusCode == StatusCodes.CONFLICT) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(statusCode).json({
      success: false,
      message: error.message || constants.INTERNAL_SERVER_ERROR,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const result = await verifyEmailService(token);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: result?.message || "Email verified",
      data: result || null,
    });
  } catch (error) {
    const statusCode = error.statusCode || StatusCodes.BAD_REQUEST;
    return res.status(statusCode).json({
      success: false,
      message: error.message || constants.INTERNAL_SERVER_ERROR,
    });
  }
};

export const personalInfo = async (req, res) => {
  try {
    const userId = req.user.id; // from authenticateToken middleware
    req.body.userId = userId;
    const result = await personalProfileInfoService(req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: result.message,
      data: result.user,
    });
  } catch (error) {
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: error.message || "Failed to save personal profile information",
      });
  }
};

export const uploadGuideIdentity = async (req, res) => {
  try {
    const guideId = req.user.id;
    const { id_number } = req.body;
    const files = req.files;

    if (!id_number) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "ID number is required");
    }

    if (!files?.government_id || !files?.selfie) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Government ID and Selfie with ID are required",
      );
    }

    // console.log();

    // Upload files
    const governmentId = await fileUploaderSingle(
      IDENTITY_DOC_UPLOAD_PATH,
      files.government_id,
    );

    const selfieWithId = await fileUploaderSingle(
      IDENTITY_DOC_UPLOAD_PATH,
      files.selfie,
    );

    let addressProof = null;
    if (files.address_proof) {
      addressProof = await fileUploaderSingle(
        IDENTITY_DOC_UPLOAD_PATH,
        files.address_proof,
      );
    }

    // Build records for DB
    const documents = [
      {
        document_category: "government_id",
        document_type: 1,
        document_file: governmentId.newfileName,
        document_number: id_number,
      },
      {
        document_category: "selfie",
        document_type: 2,
        document_file: selfieWithId.newfileName,
      },
    ];

    if (addressProof) {
      documents.push({
        document_category: "address_proof",
        document_type: 1,
        document_file: addressProof.newfileName,
      });
    }

    // Call service
    const response = await createGuideIdentityService({
      guideId,
      documents,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: response.message,
      data: response.completed_steps,
    });
  } catch (error) {
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: error.message || "Failed to upload identity documents",
      });
  }
};

export const uploadGuideLicenses = async (req, res) => {
  try {
    const guideId = req.user.id;
    const files = req.files;

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one license document is required",
      });
    }

    const LICENSE_TYPES = [
      "licensed_tour_guide",
      "tourism_department_id",
      "local_guide_permit",
      "special_activity_license",
    ];

    const documents = [];

    for (const [licenseType, file] of Object.entries(files)) {
      if (!LICENSE_TYPES.includes(licenseType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid license type: ${licenseType}`,
        });
      }

      // Handle single or multiple files per key
      const fileArray = Array.isArray(file) ? file : [file];

      for (const f of fileArray) {
        const uploadedFile = await fileUploaderSingle(
          GUIDE_LICENCE_UPLOAD_PATH,
          f
        );

        documents.push({
          license_type: licenseType,
          document_file: uploadedFile.newfileName,
        });
      }
    }

    const response = await createGuideLicenseService({
      guideId,
      documents,
    });

    return res.status(200).json({
      success: true,
      message: response.message,
      data: response.completed_steps,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to upload license documents",
    });
  }
};

export const uploadGuideInsuranceInfo = async (req, res) => {
  try {
    const guideId = req.user.id;
    const {
      insurance_provider,
      policy_number,
      policy_expiry_date,
      emergency_contact_name,
      emergency_contact_phone,
      emergency_contact_relation,
    } = req.body;

    if (!emergency_contact_name || !emergency_contact_phone) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message:
          "Emergency contact name and phone are required",
      });
    }

    let insuranceDocument = null;

    if (req.files && req.files.insurance_document) {
      const uploaded = await fileUploaderSingle(
        INSURANCE_DOC_UPLOAD_PATH,
        req.files.insurance_document
      );
      insuranceDocument = uploaded.newfileName;
    }

    const response = await createGuideInsuranceService({
      guideId,
      insurance_provider,
      policy_number,
      policy_expiry_date,
      insurance_document: insuranceDocument,
      emergency_contact_name,
      emergency_contact_phone,
      emergency_contact_relation,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: response.message,
      data: response.completed_steps,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to save insurance information",
    });
  }
};
