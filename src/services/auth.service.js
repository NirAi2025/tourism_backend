import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import ApiError from "../utils/ApiError.js";
import sequelize from "../config/database.js";
import {
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
      completed_steps: user.completed_steps,
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
  const { name, email, country_code, phone, password } = payload;

  const transaction = await sequelize.transaction();

  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email },
      transaction,
    });

    if (existingUser) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "User already exists. Please login."
      );
    }

    // Get USER role
    const userRole = await Role.findOne({
      where: { slug: "user" },
      transaction,
    });

    if (!userRole) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "User role not found"
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create(
      {
        name,
        email,
        country_code,
        phone,
        password: hashedPassword,
        auth_provider: 1,
        email_verified_at: new Date(), // mark as verified
      },
      { transaction }
    );

    await UserRole.create(
      {
        user_id: user.id,
        role_id: userRole.id,
      },
      { transaction }
    );

    await transaction.commit();
    const roles = user.roles.map((role) => role.slug) || [];
    // generate access token
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      roles,
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
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


