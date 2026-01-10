import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const { JWT } = config;

if (!JWT?.secret || !JWT?.refresh?.secret) {
  throw new Error('JWT secrets are not configured properly');
}

// ---------------------------------
// Generate JWT access token
// ---------------------------------
export function generateAccessToken(payload) {
  return jwt.sign(
    payload,
    JWT.secret,
    JWT.options
  );
}

// ---------------------------------
// Generate JWT refresh token
// ---------------------------------
export function generateRefreshToken(payload) {
  return jwt.sign(
    payload,
    JWT.refresh.secret,
    JWT.refresh.options
  );
}

// ---------------------------------
// Verify JWT access token
// ---------------------------------
export function verifyAccessToken(token) {
  return jwt.verify(token, JWT.secret);
}

// ---------------------------------
// Verify JWT refresh token
// ---------------------------------
export function verifyRefreshToken(token) {
  return jwt.verify(token, JWT.refresh.secret);
}

// ---------------------------------
// Get user ID from access token
// ---------------------------------
export function getUserId(token) {
  try {
    const decoded = verifyAccessToken(token);
    return decoded?.id || null;
  } catch {
    return null;
  }
}
