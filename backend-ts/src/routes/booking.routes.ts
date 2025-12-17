// Booking routes (traveller)

import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller.js';
import { authenticate, travellerOnly } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createBookingSchema, bookingIdParamSchema } from '../validators/booking.validators.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tourDateId
 *               - contactName
 *               - contactPhone
 *               - contactEmail
 *             properties:
 *               tourDateId:
 *                 type: string
 *               numberOfTravellers:
 *                 type: integer
 *                 default: 1
 *               contactName:
 *                 type: string
 *               contactPhone:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *                 format: email
 *               specialRequests:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created
 *       400:
 *         description: Invalid request or no spots available
 */
router.post('/', travellerOnly, validate(createBookingSchema), bookingController.createBooking);

/**
 * @swagger
 * /bookings/me:
 *   get:
 *     summary: Get user's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED]
 *     responses:
 *       200:
 *         description: User's bookings
 */
router.get('/me', bookingController.getMyBookings);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking details
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking details
 *       404:
 *         description: Booking not found
 */
router.get('/:id', validate(bookingIdParamSchema), bookingController.getBooking);

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   post:
 *     summary: Cancel booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       400:
 *         description: Cannot cancel this booking
 */
router.post('/:id/cancel', validate(bookingIdParamSchema), bookingController.cancelBooking);

export default router;

