// Cron jobs index

import { startItineraryNotifier } from './itineraryNotifier.js';
import { startCleanupJobs } from './cleanup.js';
import logger from '../utils/logger.js';

/**
 * Start all cron jobs
 */
export const startAllJobs = (): void => {
  startItineraryNotifier();
  startCleanupJobs();
  logger.info('All cron jobs initialized');
};

export { startItineraryNotifier, startCleanupJobs };

