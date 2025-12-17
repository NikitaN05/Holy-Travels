// Notification service

import prisma from '../utils/prisma.js';
import { NotFoundError } from '../utils/errors.js';
import { NotificationType, Prisma } from '@prisma/client';
import { NotificationQuery } from '../validators/notification.validators.js';

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  tourId?: string;
  bookingId?: string;
}

/**
 * Create a notification
 */
export const createNotification = async (data: CreateNotificationData) => {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      tourId: data.tourId,
      bookingId: data.bookingId,
    },
  });
};

/**
 * Create notifications for multiple users
 */
export const createBulkNotifications = async (
  userIds: string[],
  data: Omit<CreateNotificationData, 'userId'>
) => {
  return prisma.notification.createMany({
    data: userIds.map((userId) => ({
      userId,
      type: data.type,
      title: data.title,
      message: data.message,
      tourId: data.tourId,
      bookingId: data.bookingId,
    })),
  });
};

/**
 * Get user notifications
 */
export const getUserNotifications = async (userId: string, query: NotificationQuery) => {
  const { page, limit, unreadOnly } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.NotificationWhereInput = {
    userId,
    ...(unreadOnly && { isRead: false }),
  };

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({
      where: { userId, isRead: false },
    }),
  ]);

  return { notifications, total, unreadCount, page, limit };
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });

  if (!notification) {
    throw new NotFoundError('Notification not found');
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (userId: string) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
};

/**
 * Get unread count
 */
export const getUnreadCount = async (userId: string): Promise<number> => {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
};

/**
 * Delete old notifications (cleanup job)
 */
export const deleteOldNotifications = async (daysOld: number = 30) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysOld);

  return prisma.notification.deleteMany({
    where: {
      createdAt: { lt: cutoff },
      isRead: true,
    },
  });
};

// ==========================================
// NOTIFICATION HELPERS
// ==========================================

/**
 * Send itinerary reminder notification
 */
export const sendItineraryReminder = async (
  userId: string,
  tourId: string,
  itemTitle: string,
  scheduledTime: Date
) => {
  const timeStr = scheduledTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return createNotification({
    userId,
    type: 'ITINERARY_REMINDER',
    title: 'Upcoming Activity',
    message: `${itemTitle} starts at ${timeStr}`,
    tourId,
  });
};

/**
 * Send itinerary update notification
 */
export const sendItineraryUpdate = async (
  userId: string,
  tourId: string,
  itemTitle: string
) => {
  return createNotification({
    userId,
    type: 'ITINERARY_UPDATE',
    title: 'Itinerary Updated',
    message: `The activity "${itemTitle}" has been updated. Please check the latest details.`,
    tourId,
  });
};

/**
 * Send emergency alert notification
 */
export const sendEmergencyAlert = async (
  userId: string,
  tourId: string,
  alertTitle: string,
  alertMessage: string
) => {
  return createNotification({
    userId,
    type: 'EMERGENCY_ALERT',
    title: `🚨 ${alertTitle}`,
    message: alertMessage,
    tourId,
  });
};

/**
 * Send booking confirmation notification
 */
export const sendBookingConfirmation = async (
  userId: string,
  bookingId: string,
  tourTitle: string
) => {
  return createNotification({
    userId,
    type: 'BOOKING_UPDATE',
    title: 'Booking Confirmed!',
    message: `Your booking for "${tourTitle}" has been confirmed. Get ready for an amazing journey!`,
    bookingId,
  });
};

/**
 * Send booking cancellation notification
 */
export const sendBookingCancellation = async (
  userId: string,
  bookingId: string,
  tourTitle: string
) => {
  return createNotification({
    userId,
    type: 'BOOKING_UPDATE',
    title: 'Booking Cancelled',
    message: `Your booking for "${tourTitle}" has been cancelled.`,
    bookingId,
  });
};

