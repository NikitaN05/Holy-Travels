// Tour routes (public)

import { Router } from 'express';
import * as tourController from '../controllers/tour.controller.js';
import * as itineraryController from '../controllers/itinerary.controller.js';
import * as photoController from '../controllers/photo.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { tourIdParamSchema } from '../validators/tour.validators.js';
import multer from 'multer';

const router = Router();

// Multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * @swagger
 * /tours:
 *   get:
 *     summary: Get all published tours
 *     tags: [Tours]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [pilgrimage, historic, cultural, mixed]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of tours
 */
router.get('/', tourController.getTours);

/**
 * @swagger
 * /tours/featured:
 *   get:
 *     summary: Get featured tours
 *     tags: [Tours]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *     responses:
 *       200:
 *         description: Featured tours
 */
router.get('/featured', tourController.getFeaturedTours);

/**
 * @swagger
 * /tours/{id}:
 *   get:
 *     summary: Get tour details
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tour details
 *       404:
 *         description: Tour not found
 */
router.get('/:id', validate(tourIdParamSchema), tourController.getTour);

/**
 * @swagger
 * /tours/{id}/itinerary:
 *   get:
 *     summary: Get tour itinerary
 *     tags: [Tours]
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
 *         description: Tour itinerary
 *       403:
 *         description: Must book tour to view itinerary
 */
router.get('/:id/itinerary', authenticate, itineraryController.getItinerary);

/**
 * @swagger
 * /tours/{id}/emergency-alerts:
 *   get:
 *     summary: Get active emergency alerts
 *     tags: [Tours]
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
 *         description: Active alerts
 */
router.get('/:id/emergency-alerts', authenticate, itineraryController.getActiveAlerts);

/**
 * @swagger
 * /tours/{id}/photos:
 *   get:
 *     summary: Get tour photos
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tour photos
 */
router.get('/:id/photos', optionalAuth, photoController.getTourPhotos);

/**
 * @swagger
 * /tours/{id}/photos:
 *   post:
 *     summary: Upload photo (traveller with active booking)
 *     tags: [Tours]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               caption:
 *                 type: string
 *     responses:
 *       201:
 *         description: Photo uploaded
 *       403:
 *         description: Must have active booking
 */
router.post('/:id/photos', authenticate, upload.single('image'), photoController.uploadPhoto);

export default router;

