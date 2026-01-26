import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import ApiError from "../../utils/ApiError.js";
import sequelize from "../../config/database.js";
import {
  withFileUrl
} from "../../config/fileUploadPath.js";
import {
  GuideIdentity,
  GuideLicense,
  GuideInsurance,
  Profile,
  User,
  Role,
  UserRole,
  UserEmailVerification,
  GuidePayoutAccount,
  GuidePublicProfile,
  GuideLanguage,
  GuideCertification,
} from "../../models/index.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";

// --------------------------------- signup / registration ---------------------------------
export const registrationService = async (payload = {}) => {
  const {
    firstName,
    lastName,
    email,
    country_code,
    phone,
    password,
    whatsAppNumber,
    languageId,
    dob,
    nationality,
    countryOfOperation,
    stateId,
    primaryCity,
    yearsOfExperience,
  } = payload;

  return sequelize.transaction(async (transaction) => {
    const existingUser = await User.findOne({
      where: { email },
      attributes: ["id"],
      transaction,
    });

    if (existingUser) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "User already exists. Please login.",
      );
    }

    const guideRole = await Role.findOne({
      where: { slug: "guide" },
      attributes: ["id", "slug"],
      transaction,
    });

    if (!guideRole) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Guide role not found",
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create(
      {
        name: `${firstName} ${lastName}`.trim(),
        email,
        country_code,
        phone,
        password: hashedPassword,
        auth_provider: 1,
        completed_steps: 1,
        whatsapp_number: whatsAppNumber ?? null,
        language_id: languageId ?? null,
      },
      { transaction },
    );

    // Assign role
    await UserRole.create(
      {
        user_id: user.id,
        role_id: guideRole.id,
      },
      { transaction },
    );

    //  Create profile
    const profile = await Profile.create(
      {
        user_id: user.id,
        dob,
        nationality,
        tour_country_id: countryOfOperation,
        state_id: stateId,
        base_city_id: primaryCity,
        experience_years: yearsOfExperience ?? null,
      },
      { transaction },
    );

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      roles: [guideRole.slug],
    });

    return {
      success: true,
      message: "Registration completed successfully",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        country_code: user.country_code,
        phone: user.phone,
        completed_steps: user.completed_steps,
        profile,
      },
    };
  });
};

export const sendVerificationEmail = async (user) => {
  // Remove old unverified records
  await UserEmailVerification.destroy({
    where: {
      user_id: user.id,
      verified_at: null,
    },
  });

  // Generate secure token
  const token = crypto.randomBytes(32).toString("hex");

  // Expiry time (24 hours)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Store verification record
  await UserEmailVerification.create({
    user_id: user.id,
    verification_link: token,
    expires_at: expiresAt,
  });

  // Build verification URL
  // const verificationUrl = `${process.env.API_URL}/auth/verify-email?token=${token}`;
  return token;
};

export const resendVerificationEmail = async (user) => {
  if (user.email_verified_at) {
    return;
  }

  await sendVerificationEmail(user);
};

export const verifyEmailService = async (token) => {
  if (!token) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Verification token is required",
    );
  }

  const transaction = await sequelize.transaction();

  try {
    // Find valid verification record
    const verification = await UserEmailVerification.findOne({
      where: {
        verification_link: token,
        verified_at: null,
        expires_at: { [Op.gt]: new Date() },
      },
      transaction,
    });

    if (!verification) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Invalid or expired verification link",
      );
    }

    // Fetch user
    const user = await User.findOne({
      where: { id: verification.user_id },
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["slug"],
          through: { attributes: [] },
        },
      ],
      transaction,
    });

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "User not found for this verification link",
      );
    }
    const roles = Array.isArray(user.roles)
      ? user.roles.map((role) => role.slug)
      : [];
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      roles,
    });

    // If already verified
    if (user.email_verified_at) {
      await transaction.commit();
      return {
        message: "Email already verified",
      };
    }

    // Mark email as verified
    await user.update(
      {
        email_verified_at: new Date(),
      },
      { transaction },
    );

    // Mark verification record as used
    await verification.update(
      {
        verified_at: new Date(),
      },
      { transaction },
    );
    await transaction.commit();

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        country_code: user.country_code,
        phone: user.phone,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

//  step 1: personal profile info
export const personalProfileInfoService = async (payload = {}) => {
  const {
    userId,
    firstName,
    lastName,
    whatsAppNumber,
    preferredLanguage,
    dob,
    nationality,
    countryOfOperation,
    primaryCity,
    yearsOfExperience,
  } = payload;

  if (!userId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User ID is required");
  }

  const transaction = await sequelize.transaction();
  try {
    let profile = await Profile.findOne({
      where: { user_id: userId },
      transaction,
    });
    if (!profile) {
      profile = await Profile.create(
        {
          user_id: userId,
          dob,
          nationality,
          tour_country_id: countryOfOperation,
          base_city_id: primaryCity,
          experience_years: yearsOfExperience || null,
        },
        { transaction },
      );
    } else {
      await profile.update(
        {
          dob,
          nationality,
          tour_country_id: countryOfOperation,
          base_city_id: primaryCity,
          experience_years: yearsOfExperience || null,
        },
        { transaction },
      );
    }
    // update in user table
    await User.update(
      {
        name: `${firstName} ${lastName}`,
        whatsapp_number: whatsAppNumber || null,
        preferred_language: preferredLanguage || null,
        completed_steps: 2,
      },
      { where: { id: userId }, transaction },
    );
    await transaction.commit();

    return {
      message: "Personal profile information saved successfully",
      user: {
        id: userId,
        name: `${firstName} ${lastName}`,
        email: payload.email,
        country_code: payload.country_code,
        phone: payload.phone,
        completed_steps: 2,
        profile,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// step 2: guide identity documents
export const createGuideIdentityService = async (payload = {}) => {
  const { guideId, documents = [] } = payload;

  if (!guideId) {
    throw new Error("guideId is required");
  }

  if (!Array.isArray(documents) || documents.length === 0) {
    throw new Error("documents are required");
  }

  const transaction = await sequelize.transaction();

  try {
    // Extract document categories from request
    const categories = documents
      .map((doc) => doc.document_category)
      .filter(Boolean);

    // Delete existing documents for same guide + categories
    if (categories.length > 0) {
      await GuideIdentity.destroy({
        where: {
          guide_id: guideId,
          document_category: {
            [Op.in]: categories,
          },
        },
        transaction,
      });
    }

    // Prepare insert rows
    const rows = documents.map((doc) => ({
      guide_id: guideId,
      document_category: doc.document_category,
      document_type: doc.document_type,
      document_file: doc.document_file,
      document_number: doc.document_number || null,
      verification_status: 0,
    }));

    await GuideIdentity.bulkCreate(rows, { transaction });

    const user = await User.findByPk(guideId, {
      attributes: ["id", "completed_steps"],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (user && user.completed_steps < 7) {
      await user.update(
        { completed_steps: 2 },
        { transaction }
      );
    }

    await transaction.commit();

    return {
      message: "Identity documents submitted successfully",
      completed_steps: user.completed_steps
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// step 3: guide license documents
export const createGuideLicenseService = async (payload = {}) => {
  const { guideId, documents } = payload;
  const transaction = await sequelize.transaction();

  try {
    // Extract license types from request
    const licenseTypes = documents
      .map((doc) => doc.license_type)
      .filter(Boolean);

    if (licenseTypes.length > 0) {
      await GuideLicense.destroy({
        where: {
          guide_id: guideId,
          license_type: {
            [Op.in]: licenseTypes,
          },
        },
        transaction,
      });
    }

    const rows = documents.map((doc) => ({
      guide_id: guideId,
      license_type: doc.license_type,
      document_file: doc.document_file,
      verification_status: 0,
    }));

    await GuideLicense.bulkCreate(rows, { transaction });

    const user = await User.findByPk(guideId, {
      attributes: ["id", "completed_steps"],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (user && user.completed_steps < 7) {
      await user.update(
        { completed_steps: 3 },
        { transaction }
      );
    }

    await transaction.commit();

    return {
      message: "License documents uploaded successfully",
      completed_steps: user.completed_steps
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// step 4: guide insurance and emergency contact info
export const createGuideInsuranceService = async (payload = {}) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      guideId,
      insurance_provider,
      policy_number,
      policy_expiry_date,
      insurance_document,
      emergency_contact_name,
      emergency_contact_phone,
      emergency_contact_relation,
    } = payload;

    await GuideInsurance.upsert(
      {
        guide_id: guideId,
        insurance_provider: insurance_provider || null,
        policy_number: policy_number || null,
        policy_expiry_date: policy_expiry_date || null,
        insurance_document: insurance_document || null,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_relation: emergency_contact_relation || null,
      },
      { transaction },
    );

    const user = await User.findByPk(guideId, {
      attributes: ["id", "completed_steps"],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (user && user.completed_steps < 7) {
      await user.update(
        { completed_steps: 4 },
        { transaction }
      );
    }

    await transaction.commit();

    return {
      message: "Insurance and emergency information saved successfully",
      completed_steps: user.completed_steps
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// step 5: guide languages and skills
export const guideLanguageAndSkillsService = async (payload = {}) => {
  const transaction = await sequelize.transaction();
  try{
    const {
      guideId,
      language_ids = [],
      primary_language_id,
      certification_type = "first_aid", 
      certification_document,
    } = payload;

    if (!guideId) {
      throw new Error("guideId is required");
    }

    // return sequelize.transaction(async (transaction) => {
      if (Array.isArray(language_ids) && language_ids.length > 0) {
        // delete existing languages
        await GuideLanguage.destroy({
          where: { guide_id: guideId },
          transaction,
        });

        const languageRows = language_ids.map((languageId) => ({
          guide_id: guideId,
          language_id: languageId,
          is_primary: Number(languageId) == Number(primary_language_id),
        }));

        await GuideLanguage.bulkCreate(languageRows, { transaction });
      }
      if (certification_document) {
        // delete existing certification of same type
        await GuideCertification.destroy({
          where: {
            guide_id: guideId,
            certification_type,
          },
          transaction,
        });

        // insert new certification
        await GuideCertification.create(
          {
            guide_id: guideId,
            certification_type,
            certificate_file: certification_document,
          },
          { transaction }
        );
      }
      
      const user = await User.findByPk(guideId, {
        attributes: ["id", "completed_steps"],
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (user && user.completed_steps < 7) {
        await user.update(
          { completed_steps: 5 },
          { transaction }
        );
      }
      await transaction.commit();
      return {
        message: "Languages and skills saved successfully",
        completed_steps: user.completed_steps
      };
    // });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const guidePayoutInfoService = async (payload = {}) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      guideId,
      account_holder_name,
      bank_name,
      account_number,
      ifsc_swift_bic,
      payout_currency,
      payout_method,
      tax_residency_country_id,
      tax_id,
    } = payload;

    // check if record already exists
    const existing = await GuidePayoutAccount.findOne({
      where: { guide_id: guideId },
      transaction,
    });

    if (existing) {
      await existing.update(
        {
          account_holder_name,
          bank_name,
          account_number,
          routing_code: ifsc_swift_bic,
          payout_currency,
          payout_method,
          tax_residency_country_id,
          tax_id,
        },
        { transaction },
      );
      const user = await User.findByPk(guideId, {
      attributes: ["id", "completed_steps"],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (user && user.completed_steps < 7) {
      await user.update(
        { completed_steps: 6 },
        { transaction }
      );
    }
      await transaction.commit();

      return {
        message: "Payout information updated successfully",
        completed_steps: user.completed_steps,
      };
    }

    // create new record
    await GuidePayoutAccount.create(
      {
        guide_id: guideId,
        account_holder_name,
        bank_name,
        account_number,
        routing_code: ifsc_swift_bic,
        payout_currency,
        payout_method,
        tax_residency_country_id,
        tax_id,
      },
      { transaction },
    );
    await User.update(
      { completed_steps: 6 },
      { where: { id: guideId }, transaction },
    );
    await transaction.commit();

    return {
      message: "Payout information saved successfully",
      completed_steps: 6,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
export const guidePublicInfoService = async (payload = {}) => {
  const {
    guideId,
    bio,
    profile_photo,
    external_review_links,
    social_media_url,
  } = payload;

  return sequelize.transaction(async (transaction) => {
    // Upsert public profile (create or update)
    await GuidePublicProfile.upsert(
      {
        guide_id: guideId,
        bio,
        profile_photo,
        google_review_url: external_review_links,
        social_media_url,
      },
      { transaction },
    );

    // Update onboarding step
    const user = await User.findByPk(guideId, {
      attributes: ["id", "completed_steps"],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (user && user.completed_steps < 7) {
      await user.update(
        { completed_steps: 7 },
        { transaction }
      );
    }

    await transaction.commit();

    return {
      message: "Profile information saved successfully",
      completed_steps: 7,
    };
  });
};

// --------------------------------- signup / registration ---------------------------------

export const myProfileService = async (guideId) => {
  const guideProfile = await User.findOne({
    where: { id: guideId },
    attributes: { exclude: ["password"] },
    include: [
      { model: Profile, as: "profile" },
      { model: GuideIdentity, as: "guide_identities" },
      { model: GuideLicense, as: "guide_licenses" },
      { model: GuideInsurance, as: "guide_insurances" },
      { model: GuidePayoutAccount, as: "guide_payout_account" },
      { model: GuidePublicProfile, as: "guide_public_profile" },
      { model: GuideLanguage, as: "guide_languages" },
      { model: GuideCertification, as: "guide_certifications" },
    ],
  });

  if (!guideProfile) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Guide profile not found");
  }

  const data = guideProfile.toJSON();
  
  if (data.guide_public_profile?.profile_photo) {
    data.guide_public_profile.profile_photo = withFileUrl(
      data.guide_public_profile.profile_photo,
      "profile"
    );
  }
  data.guide_identities?.forEach((doc) => {
    doc.document_file = withFileUrl(doc.document_file, "identity-doc");
  });
  data.guide_licenses?.forEach((license) => {
    license.document_file = withFileUrl(
      license.document_file,
      "identity-doc"
    );
  });
  if (data.guide_insurance?.insurance_document) {
    data.guide_insurance.insurance_document = withFileUrl(
      data.guide_insurance.insurance_document,
      "identity-doc"
    );
  }
  data.guide_certifications?.forEach((cert) => {
    cert.certificate_file = withFileUrl(
      cert.certificate_file,
      "identity-doc"
    );
  });

  return data;
};