// Photo routes

import { Router } from 'express';
import * as photoController from '../controllers/photo.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /photos/{id}:
 *   delete:
 *     summary: Delete photo
 *     tags: [Photos]
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
 *         description: Photo deleted
 *       403:
 *         description: Can only delete own photos
 */
router.delete('/:id', authenticate, photoController.deletePhoto);

export default router;

