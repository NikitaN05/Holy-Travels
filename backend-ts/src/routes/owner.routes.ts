// Owner routes (admin)

import { Router } from 'express';
import * as tourController from '../controllers/tour.controller.js';
import * as bookingController from '../controllers/booking.controller.js';
import * as itineraryController from '../controllers/itinerary.controller.js';
import * as photoController from '../controllers/photo.controller.js';
import { authenticate, ownerOnly } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createTourSchema,
  updateTourSchema,
  tourIdParamSchema,
  createTourDateSchema,
  updateTourDateSchema,
} from '../validators/tour.validators.js';
import {
  updateBookingStatusSchema,
  bookingIdParamSchema,
} from '../validators/booking.validators.js';
import {
  createItineraryItemSchema,
  updateItineraryItemSchema,
  itineraryItemIdParamSchema,
  emergencyAlertSchema,
} from '../validators/itinerary.validators.js';

const router = Router();

// All owner routes require authentication and OWNER role
router.use(authenticate);
router.use(ownerOnly);

// ==========================================
// TOURS
// ==========================================

/**
 * @swagger
 * /owner/tours:
 *   get:
 *     summary: Get all tours (including drafts)
 *     tags: [Owner - Tours]
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
 *           enum: [DRAFT, PUBLISHED, ARCHIVED]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All tours
 */
router.get('/tours', tourController.getOwnerTours);

/**
 * @swagger
 * /owner/tours/{id}:
 *   get:
 *     summary: Get tour by ID
 *     tags: [Owner - Tours]
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
 *         description: Tour details
 */
router.get('/tours/:id', validate(tourIdParamSchema), tourController.getOwnerTour);

/**
 * @swagger
 * /owner/tours:
 *   post:
 *     summary: Create tour
 *     tags: [Owner - Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTour'
 *     responses:
 *       201:
 *         description: Tour created
 */
router.post('/tours', validate(createTourSchema), tourController.createTour);

/**
 * @swagger
 * /owner/tours/{id}:
 *   patch:
 *     summary: Update tour
 *     tags: [Owner - Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTour'
 *     responses:
 *       200:
 *         description: Tour updated
 */
router.patch('/tours/:id', validate(updateTourSchema), tourController.updateTour);

/**
 * @swagger
 * /owner/tours/{id}:
 *   delete:
 *     summary: Delete tour
 *     tags: [Owner - Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Tour deleted
 */
router.delete('/tours/:id', validate(tourIdParamSchema), tourController.deleteTour);

// ==========================================
// TOUR DATES
// ==========================================

/**
 * @swagger
 * /owner/tours/{id}/dates:
 *   post:
 *     summary: Add tour date
 *     tags: [Owner - Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startDate
 *               - endDate
 *               - availableSpots
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               availableSpots:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tour date added
 */
router.post('/tours/:id/dates', validate(createTourDateSchema), tourController.addTourDate);

router.patch('/tours/:id/dates/:dateId', validate(updateTourDateSchema), tourController.updateTourDate);
router.delete('/tours/:id/dates/:dateId', tourController.deleteTourDate);

// ==========================================
// ITINERARY
// ==========================================

/**
 * @swagger
 * /owner/tours/{id}/itinerary:
 *   post:
 *     summary: Add itinerary item
 *     tags: [Owner - Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItineraryItem'
 *     responses:
 *       201:
 *         description: Item created
 */
router.post('/tours/:id/itinerary', validate(createItineraryItemSchema), itineraryController.createItem);

router.patch('/tours/:id/itinerary/:itemId', validate(updateItineraryItemSchema), itineraryController.updateItem);
router.delete('/tours/:id/itinerary/:itemId', validate(itineraryItemIdParamSchema), itineraryController.deleteItem);

// ==========================================
// EMERGENCY ALERTS
// ==========================================

/**
 * @swagger
 * /owner/tours/{id}/emergency-alerts:
 *   post:
 *     summary: Create emergency alert
 *     tags: [Owner - Emergency]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               severity:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *     responses:
 *       201:
 *         description: Alert sent
 */
router.post('/tours/:id/emergency-alerts', validate(emergencyAlertSchema), itineraryController.createEmergencyAlert);
router.patch('/tours/:id/emergency-alerts/:alertId/deactivate', itineraryController.deactivateAlert);

// ==========================================
// BOOKINGS
// ==========================================

/**
 * @swagger
 * /owner/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Owner - Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED]
 *       - in: query
 *         name: tourId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All bookings
 */
router.get('/bookings', bookingController.getAllBookings);

/**
 * @swagger
 * /owner/bookings/{id}:
 *   patch:
 *     summary: Update booking status
 *     tags: [Owner - Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, CANCELLED]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/bookings/:id', validate(updateBookingStatusSchema), bookingController.updateBookingStatus);

// ==========================================
// PHOTOS
// ==========================================

router.patch('/photos/:id/approval', photoController.toggleApproval);

export default router;

