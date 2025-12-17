// Cron job for itinerary notifications

import cron from 'node-cron';
import { getDueItineraryItems, markItemNotified } from '../services/itinerary.service.js';
import { sendItineraryReminder } from '../services/notification.service.js';
import { emitToUser } from '../sockets/index.js';
import logger from '../utils/logger.js';

const MINUTES_AHEAD = 30; // Notify 30 minutes before

/**
 * Check for due itinerary items and send notifications
 */
const processItineraryNotifications = async (): Promise<void> => {
  try {
    const dueItems = await getDueItineraryItems(MINUTES_AHEAD);

    for (const item of dueItems) {
      // Get all travellers with active bookings for this tour
      for (const tourDate of item.tour.tourDates) {
        for (const booking of tourDate.bookings) {
          // Create notification
          await sendItineraryReminder(
            booking.user.id,
            item.tourId,
            item.title,
            item.scheduledTime!
          );

          // Emit socket event
          emitToUser(booking.user.id, 'notification:new', {
            type: 'ITINERARY_REMINDER',
            title: 'Upcoming Activity',
            message: `${item.title} starts soon`,
            tourId: item.tourId,
          });

          logger.info({
            userId: booking.user.id,
            itemId: item.id,
            itemTitle: item.title,
          }, 'Itinerary reminder sent');
        }
      }

      // Mark item as notified
      await markItemNotified(item.id);
    }

    if (dueItems.length > 0) {
      logger.info({ count: dueItems.length }, 'Processed itinerary notifications');
    }
  } catch (error) {
    logger.error({ error }, 'Error processing itinerary notifications');
  }
};

/**
 * Start the itinerary notification cron job
 * Runs every minute
 */
export const startItineraryNotifier = (): void => {
  // Run every minute
  cron.schedule('* * * * *', processItineraryNotifications);
  logger.info('Itinerary notifier cron job started');
};

export default startItineraryNotifier;

