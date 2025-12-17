// Authentication controller

import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

/**
 * Register new traveller
 * POST /auth/register
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.register(req.body);
    
    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendCreated(res, {
      user: result.user,
      accessToken: result.tokens.accessToken,
    }, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.login(req.body);
    
    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, {
      user: result.user,
      accessToken: result.tokens.accessToken,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh tokens
 * POST /auth/refresh
 */
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    
    const tokens = await authService.refreshTokens(refreshToken);
    
    // Update cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, {
      accessToken: tokens.accessToken,
    }, 'Tokens refreshed');
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * POST /auth/logout
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    
    // Clear cookie
    res.clearCookie('refreshToken');

    sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user
 * GET /auth/me
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await authService.getUserById(req.user!.userId);
    sendSuccess(res, { user });
  } catch (error) {
    next(error);
  }
};

