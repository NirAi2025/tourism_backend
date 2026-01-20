import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import ApiError from "../utils/ApiError.js";
import sequelize from "../config/database.js";
import {
  GuideIdentity,
  GuideLicense,
  GuideInsurance,
  Profile,
  User,
  Role,
  UserRole,
  UserEmailVerification,
} from "../models/index.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

export const loginService = async (payload = {}) => {
  const { email, password } = payload;
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  // Find user by email
  const user = await User.findOne({
    where: { email },
    include: [
      {
        model: Role,
        through: { attributes: [] },
      },
    ],
  });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const roles = user.roles.map((role) => role.slug) || [];
  // generate access token
  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    roles,
  });
  // generate refresh token
  const refreshToken = generateRefreshToken({
    userId: user.id,
  });
  return {
    accessToken,
    // refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      roles,
    },
  };
};

export const findOrCreateGoogleUser = async ({
  email,
  googleId,
  name,
  profileImage,
}) => {
  // find user role
  const userRole = await Role.findOne({ where: { slug: "user" } });
  if (!userRole) {
    throw new Error("User role not found");
  }
  console.log("req ", email, googleId, name, profileImage);

  let user = await User.findOne({
    where: { email },
  });

  if (!user) {
    user = await User.create({
      email,
      name,
      email_verified_at: new Date(),
      profile_image: profileImage,
      auth_provider: 2,
      provider_id: googleId,
      created_at: new Date(),
    });

    // assign role
    await UserRole.create({
      user_id: user.id,
      role_id: userRole.id,
    });
  }
  return user;
};

export const registrationService = async (payload = {}) => {
  const { firstName, lastName, email, country_code, phone, password } = payload;

  const transaction = await sequelize.transaction();

  try {
    // Get guide role
    const guideRole = await Role.findOne({
      where: { slug: "guide" },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!guideRole) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Guide role not found",
      );
    }

    // Check if user exists
    let user = await User.findOne({
      where: { email },
      transaction,
    });

    let isNewUser = false;

    // Create user if not exists
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);

      user = await User.create(
        {
          name: `${firstName} ${lastName}`,
          email,
          country_code,
          phone,
          password: hashedPassword,
          auth_provider: 1,
          email_verified_at: null,
          completed_steps: 1,
        },
        { transaction },
      );

      isNewUser = true;
    } else if (!user.email_verified_at) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "This email is already registered but not verified.",
      );
    }

    // Check if already guide
    const alreadyGuide = await UserRole.findOne({
      where: {
        user_id: user.id,
        role_id: guideRole.id,
      },
      transaction,
    });

    if (alreadyGuide) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "User is already registered as a guide. Please login.",
      );
    }

    // Assign guide role
    await UserRole.create(
      {
        user_id: user.id,
        role_id: guideRole.id,
      },
      { transaction },
    );

    await transaction.commit();

    if (isNewUser) {
      await sendVerificationEmail(user);
    }

    return {
      id: user.id,
      email: user.email,
      message: "Registration successful. Please verify your email.",
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
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
  const verificationUrl = `${process.env.API_URL}/auth/verify-email?token=${token}`;
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

export const createGuideIdentityService = async (payload = {}) => {
  const { guideId, documents } = payload;
  const transaction = await sequelize.transaction();
  try {
    const rows = documents.map((doc) => ({
      guide_id: guideId,
      document_category: doc.document_category,
      document_type: doc.document_type,
      document_file: doc.document_file,
      document_number: doc.document_number || null,
      verification_status: 0,
    }));

    await GuideIdentity.bulkCreate(rows);
    await User.update(
      {
        completed_steps: 3,
      },
      { where: { id: guideId }, transaction },
    );
    await transaction.commit();
    return {
      message: "Identity documents submitted successfully",
      completed_steps: 3,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
export const createGuideLicenseService = async (payload = {}) => {
  const { guideId, documents } = payload;
  const transaction = await sequelize.transaction();

  try {
    const rows = documents.map((doc) => ({
      guide_id: guideId,
      license_type: doc.license_type,
      document_file: doc.document_file,
      verification_status: 0,
    }));

    await GuideLicense.bulkCreate(rows, { transaction });

    await User.update(
      { completed_steps: 4 },
      { where: { id: guideId }, transaction },
    );

    await transaction.commit();

    return {
      message: "License documents uploaded successfully",
      completed_steps: 4,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

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
      { transaction }
    );

    await User.update(
      { completed_steps: 5 },
      { where: { id: guideId }, transaction }
    );

    await transaction.commit();

    return {
      message: "Insurance and emergency information saved successfully",
      completed_steps: 5,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
