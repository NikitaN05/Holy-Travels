// Routes index

import { Router } from 'express';
import authRoutes from './auth.routes.js';
import tourRoutes from './tour.routes.js';
import bookingRoutes from './booking.routes.js';
import ownerRoutes from './owner.routes.js';
import notificationRoutes from './notification.routes.js';
import photoRoutes from './photo.routes.js';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/tours', tourRoutes);
router.use('/bookings', bookingRoutes);
router.use('/owner', ownerRoutes);
router.use('/notifications', notificationRoutes);
router.use('/photos', photoRoutes);

export default router;

