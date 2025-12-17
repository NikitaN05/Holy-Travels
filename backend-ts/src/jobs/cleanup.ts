// Cleanup cron jobs

import cron from 'node-cron';
import prisma from '../utils/prisma.js';
import { deleteOldNotifications } from '../services/notification.service.js';
import logger from '../utils/logger.js';

/**
 * Clean up expired refresh tokens
 */
const cleanupExpiredTokens = async (): Promise<void> => {
  try {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    if (result.count > 0) {
      logger.info({ count: result.count }, 'Cleaned up expired refresh tokens');
    }
  } catch (error) {
    logger.error({ error }, 'Error cleaning up refresh tokens');
  }
};

/**
 * Clean up old notifications (30 days old, already read)
 */
const cleanupOldNotifications = async (): Promise<void> => {
  try {
    const result = await deleteOldNotifications(30);
    if (result.count > 0) {
      logger.info({ count: result.count }, 'Cleaned up old notifications');
    }
  } catch (error) {
    logger.error({ error }, 'Error cleaning up notifications');
  }
};

/**
 * Update tour date active status based on current date
 */
const updateTourDateStatus = async (): Promise<void> => {
  try {
    const now = new Date();

    // Activate tour dates that have started
    const activated = await prisma.tourDate.updateMany({
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
        isActive: false,
      },
      data: { isActive: true },
    });

    // Deactivate tour dates that have ended
    const deactivated = await prisma.tourDate.updateMany({
      where: {
        endDate: { lt: now },
        isActive: true,
      },
      data: { isActive: false },
    });

    if (activated.count > 0 || deactivated.count > 0) {
      logger.info({
        activated: activated.count,
        deactivated: deactivated.count,
      }, 'Updated tour date statuses');
    }
  } catch (error) {
    logger.error({ error }, 'Error updating tour date status');
  }
};

/**
 * Start all cleanup cron jobs
 */
export const startCleanupJobs = (): void => {
  // Clean up expired tokens every hour
  cron.schedule('0 * * * *', cleanupExpiredTokens);

  // Clean up old notifications daily at 3 AM
  cron.schedule('0 3 * * *', cleanupOldNotifications);

  // Update tour date status every 15 minutes
  cron.schedule('*/15 * * * *', updateTourDateStatus);

  // Run immediately on startup
  updateTourDateStatus();

  logger.info('Cleanup cron jobs started');
};

export default startCleanupJobs;

