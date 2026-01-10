import bcrypt from "bcryptjs";
import { User, Role, UserRole } from "../models/index.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

export async function loginService(payload = {}) {
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
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      roles,
    },
  };
}

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
