// Authentication service

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/index.js';
import prisma from '../utils/prisma.js';
import { UnauthorizedError, ConflictError, NotFoundError } from '../utils/errors.js';
import { toJwtPayload, toPrivateUser } from '../utils/userSanitizer.js';
import { RegisterInput, LoginInput } from '../validators/auth.validators.js';
import type { User, Role } from '@prisma/client';

const SALT_ROUNDS = 12;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: ReturnType<typeof toPrivateUser>;
  tokens: TokenPair;
}

/**
 * Generate JWT access token
 */
const generateAccessToken = (user: User): string => {
  const payload = toJwtPayload(user);
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpires,
  });
};

/**
 * Generate refresh token and store in database
 */
const generateRefreshToken = async (userId: string): Promise<string> => {
  const token = crypto.randomBytes(64).toString('hex');
  
  // Calculate expiry (parse string like "7d" to milliseconds)
  const expiresIn = config.jwt.refreshExpires;
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  let expiresMs = 7 * 24 * 60 * 60 * 1000; // Default 7 days
  
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2];
    switch (unit) {
      case 'd': expiresMs = value * 24 * 60 * 60 * 1000; break;
      case 'h': expiresMs = value * 60 * 60 * 1000; break;
      case 'm': expiresMs = value * 60 * 1000; break;
      case 's': expiresMs = value * 1000; break;
    }
  }

  const expiresAt = new Date(Date.now() + expiresMs);

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
};

/**
 * Register a new traveller
 */
export const register = async (data: RegisterInput): Promise<AuthResult> => {
  // Check if email already exists
  const existing = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (existing) {
    throw new ConflictError('Email already registered');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash,
      fullName: data.fullName,
      displayName: data.displayName || data.fullName.split(' ')[0],
      phone: data.phone,
      role: 'TRAVELLER',
    },
  });

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user.id);

  return {
    user: toPrivateUser(user),
    tokens: { accessToken, refreshToken },
  };
};

/**
 * Login user
 */
export const login = async (data: LoginInput): Promise<AuthResult> => {
  const user = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Account is deactivated');
  }

  // Verify password
  const isValid = await bcrypt.compare(data.password, user.passwordHash);
  if (!isValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user.id);

  return {
    user: toPrivateUser(user),
    tokens: { accessToken, refreshToken },
  };
};

/**
 * Refresh access token
 */
export const refreshTokens = async (refreshToken: string): Promise<TokenPair> => {
  // Find refresh token
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  // Check expiry
  if (storedToken.expiresAt < new Date()) {
    // Delete expired token
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new UnauthorizedError('Refresh token expired');
  }

  // Check user is still active
  if (!storedToken.user.isActive) {
    throw new UnauthorizedError('Account is deactivated');
  }

  // Delete old refresh token (rotation)
  await prisma.refreshToken.delete({ where: { id: storedToken.id } });

  // Generate new tokens
  const newAccessToken = generateAccessToken(storedToken.user);
  const newRefreshToken = await generateRefreshToken(storedToken.user.id);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

/**
 * Logout - invalidate refresh token
 */
export const logout = async (refreshToken: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
};

/**
 * Logout all sessions for a user
 */
export const logoutAll = async (userId: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<ReturnType<typeof toPrivateUser>> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return toPrivateUser(user);
};

/**
 * Create owner account (for seeding/admin purposes only)
 */
export const createOwner = async (
  email: string,
  password: string,
  fullName: string
): Promise<User> => {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  return prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      fullName,
      displayName: fullName.split(' ')[0],
      role: 'OWNER',
    },
  });
};

