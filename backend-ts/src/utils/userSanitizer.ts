// User data sanitization for privacy
// Ensures sensitive data is never exposed in public endpoints

import { User } from '@prisma/client';

export interface PublicUser {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface PrivateUser {
  id: string;
  email: string;
  role: string;
  fullName: string;
  displayName: string;
  phone: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Returns only public-safe user data
 * Use this for any response that could be seen by other users
 */
export const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  displayName: user.displayName,
  avatarUrl: user.avatarUrl,
});

/**
 * Returns full user data
 * Use this ONLY for owner/admin views or the user's own profile
 */
export const toPrivateUser = (user: User): PrivateUser => ({
  id: user.id,
  email: user.email,
  role: user.role,
  fullName: user.fullName,
  displayName: user.displayName,
  phone: user.phone,
  avatarUrl: user.avatarUrl,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/**
 * Generates an anonymous display name
 * Use when displayName is not set
 */
export const generateAnonymousName = (userId: string): string => {
  const shortId = userId.slice(-4).toUpperCase();
  return `Traveller ${shortId}`;
};

/**
 * Sanitize user for JWT payload
 */
export const toJwtPayload = (user: User) => ({
  userId: user.id,
  email: user.email,
  role: user.role,
});

