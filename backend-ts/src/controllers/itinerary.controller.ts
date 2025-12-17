// Itinerary controller

import { Request, Response, NextFunction } from 'express';
import * as itineraryService from '../services/itinerary.service.js';
import * as notificationService from '../services/notification.service.js';
import * as bookingService from '../services/booking.service.js';
import * as emailService from '../services/email.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response.js';
import { getSocketIO } from '../sockets/index.js';

/**
 * Get tour itinerary
 * GET /tours/:id/itinerary
 */
export const getItinerary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isOwner = req.user?.role === 'OWNER';
    const items = await itineraryService.getTourItinerary(
      req.params.id,
      req.user?.userId,
      isOwner
    );
    sendSuccess(res, { itinerary: items });
  } catch (error) {
    next(error);
  }
};

/**
 * Create itinerary item
 * POST /owner/tours/:id/itinerary
 */
export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const item = await itineraryService.createItineraryItem(req.params.id, req.body);
    
    // Notify active travellers about new itinerary item
    const io = getSocketIO();
    io?.to(`tour:${req.params.id}`).emit('itinerary:updated', {
      tourId: req.params.id,
      action: 'added',
      item,
    });

    sendCreated(res, { item }, 'Itinerary item created');
  } catch (error) {
    next(error);
  }
};

/**
 * Update itinerary item
 * PATCH /owner/tours/:id/itinerary/:itemId
 */
export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const item = await itineraryService.updateItineraryItem(
      req.params.id,
      req.params.itemId,
      req.body
    );

    // Notify active travellers
    const io = getSocketIO();
    const activeTravellers = await bookingService.getActiveTravellers(req.params.id);
    
    // Send notifications
    for (const traveller of activeTravellers) {
      await notificationService.sendItineraryUpdate(
        traveller.userId,
        req.params.id,
        item.title
      );
    }

    // Emit socket events
    io?.to(`tour:${req.params.id}`).emit('itinerary:updated', {
      tourId: req.params.id,
      action: 'updated',
      item,
    });

    sendSuccess(res, { item }, 'Itinerary item updated');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete itinerary item
 * DELETE /owner/tours/:id/itinerary/:itemId
 */
export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await itineraryService.deleteItineraryItem(req.params.id, req.params.itemId);

    const io = getSocketIO();
    io?.to(`tour:${req.params.id}`).emit('itinerary:updated', {
      tourId: req.params.id,
      action: 'deleted',
      itemId: req.params.itemId,
    });

    sendNoContent(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Create emergency alert
 * POST /owner/tours/:id/emergency-alerts
 */
export const createEmergencyAlert = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const alert = await itineraryService.createEmergencyAlert(req.params.id, req.body);

    // Get active travellers
    const activeTravellers = await bookingService.getActiveTravellers(req.params.id);
    const io = getSocketIO();

    // Get tour info for email
    const tour = await itineraryService.getTourItinerary(req.params.id, undefined, true);

    // Send notifications to all active travellers
    for (const traveller of activeTravellers) {
      // Create notification
      await notificationService.sendEmergencyAlert(
        traveller.userId,
        req.params.id,
        alert.title,
        alert.message
      );

      // Socket event
      io?.to(`user:${traveller.userId}`).emit('emergency:new', {
        tourId: req.params.id,
        alert,
      });

      // Email notification for emergency
      emailService.sendEmergencyAlertEmail(traveller.email, {
        name: traveller.fullName,
        tourTitle: 'Active Tour', // Would need to fetch tour title
        alertTitle: alert.title,
        alertMessage: alert.message,
        severity: alert.severity,
      });
    }

    sendCreated(res, { alert }, 'Emergency alert sent');
  } catch (error) {
    next(error);
  }
};

/**
 * Get active alerts
 * GET /tours/:id/emergency-alerts
 */
export const getActiveAlerts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const alerts = await itineraryService.getActiveAlerts(req.params.id);
    sendSuccess(res, { alerts });
  } catch (error) {
    next(error);
  }
};

/**
 * Deactivate alert
 * PATCH /owner/tours/:id/emergency-alerts/:alertId/deactivate
 */
export const deactivateAlert = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const alert = await itineraryService.deactivateAlert(req.params.alertId);
    sendSuccess(res, { alert }, 'Alert deactivated');
  } catch (error) {
    next(error);
  }
};

