// Global error handling middleware

import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors.js';
import { sendError } from '../utils/response.js';
import logger from '../utils/logger.js';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  // Log error
  logger.error({
    err,
    method: req.method,
    url: req.url,
    userId: req.user?.userId,
  }, 'Request error');

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return sendError(res, 409, 'CONFLICT', 'A record with this value already exists');
      case 'P2025':
        return sendError(res, 404, 'NOT_FOUND', 'Record not found');
      case 'P2003':
        return sendError(res, 400, 'FOREIGN_KEY_VIOLATION', 'Invalid reference');
      default:
        return sendError(res, 500, 'DATABASE_ERROR', 'Database error occurred');
    }
  }

  // Handle validation errors
  if (err instanceof ValidationError) {
    return sendError(res, err.statusCode, err.code, err.message, err.errors);
  }

  // Handle AppError
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.code, err.message);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'INVALID_TOKEN', 'Invalid authentication token');
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'TOKEN_EXPIRED', 'Authentication token has expired');
  }

  // Default error
  const isProduction = process.env.NODE_ENV === 'production';
  return sendError(
    res,
    500,
    'INTERNAL_ERROR',
    isProduction ? 'An unexpected error occurred' : err.message
  );
};

/**
 * Handle 404 - Not Found
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  return sendError(res, 404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`);
};

