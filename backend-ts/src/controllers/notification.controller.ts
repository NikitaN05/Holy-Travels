// Notification controller

import { Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notification.service.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

/**
 * Get user notifications
 * GET /notifications/me
 */
export const getMyNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      unreadOnly: req.query.unreadOnly === 'true',
    };

    const result = await notificationService.getUserNotifications(
      req.user!.userId,
      query
    );

    sendSuccess(res, {
      notifications: result.notifications,
      unreadCount: result.unreadCount,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark notification as read
 * PATCH /notifications/:id/read
 */
export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user!.userId
    );
    sendSuccess(res, { notification }, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 * POST /notifications/read-all
 */
export const markAllAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await notificationService.markAllAsRead(req.user!.userId);
    sendSuccess(res, null, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread count
 * GET /notifications/unread-count
 */
export const getUnreadCount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const count = await notificationService.getUnreadCount(req.user!.userId);
    sendSuccess(res, { unreadCount: count });
  } catch (error) {
    next(error);
  }
};

