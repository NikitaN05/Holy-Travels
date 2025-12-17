// Booking controller

import { Request, Response, NextFunction } from 'express';
import * as bookingService from '../services/booking.service.js';
import * as notificationService from '../services/notification.service.js';
import * as emailService from '../services/email.service.js';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response.js';
import { getSocketIO } from '../sockets/index.js';

// ==========================================
// TRAVELLER ENDPOINTS
// ==========================================

/**
 * Create booking
 * POST /bookings
 */
export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const booking = await bookingService.createBooking(req.user!.userId, req.body);
    sendCreated(res, { booking }, 'Booking created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's bookings
 * GET /bookings/me
 */
export const getMyBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      status: req.query.status as string,
    };

    const result = await bookingService.getUserBookings(req.user!.userId, query);
    sendPaginated(res, result.bookings, result.page, result.limit, result.total);
  } catch (error) {
    next(error);
  }
};

/**
 * Get single booking
 * GET /bookings/:id
 */
export const getBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const booking = await bookingService.getBookingById(
      req.params.id,
      req.user!.userId
    );
    sendSuccess(res, { booking });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel booking
 * POST /bookings/:id/cancel
 */
export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const booking = await bookingService.cancelBooking(
      req.params.id,
      req.user!.userId
    );
    sendSuccess(res, { booking }, 'Booking cancelled successfully');
  } catch (error) {
    next(error);
  }
};

// ==========================================
// OWNER ENDPOINTS
// ==========================================

/**
 * Get all bookings
 * GET /owner/bookings
 */
export const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      status: req.query.status as string,
      tourId: req.query.tourId as string,
    };

    const result = await bookingService.getAllBookings(query);
    sendPaginated(res, result.bookings, result.page, result.limit, result.total);
  } catch (error) {
    next(error);
  }
};

/**
 * Update booking status
 * PATCH /owner/bookings/:id
 */
export const updateBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const booking = await bookingService.updateBookingStatus(req.params.id, req.body);

    // Send notifications based on status change
    const io = getSocketIO();
    
    if (req.body.status === 'CONFIRMED') {
      // Send notification
      await notificationService.sendBookingConfirmation(
        booking.userId,
        booking.id,
        booking.tourDate.tour.title
      );

      // Emit socket event
      io?.to(`user:${booking.userId}`).emit('notification:new', {
        type: 'BOOKING_UPDATE',
        title: 'Booking Confirmed!',
        message: `Your booking for "${booking.tourDate.tour.title}" has been confirmed.`,
      });

      // Send email
      emailService.sendBookingConfirmationEmail(booking.contactEmail, {
        name: booking.contactName,
        tourTitle: booking.tourDate.tour.title,
        startDate: booking.tourDate.startDate,
        endDate: booking.tourDate.endDate,
        numberOfTravellers: booking.numberOfTravellers,
        totalAmount: booking.totalAmount.toString(),
        bookingId: booking.id,
      });
    } else if (req.body.status === 'CANCELLED') {
      await notificationService.sendBookingCancellation(
        booking.userId,
        booking.id,
        booking.tourDate.tour.title
      );

      io?.to(`user:${booking.userId}`).emit('notification:new', {
        type: 'BOOKING_UPDATE',
        title: 'Booking Cancelled',
        message: `Your booking for "${booking.tourDate.tour.title}" has been cancelled.`,
      });
    }

    sendSuccess(res, { booking }, 'Booking status updated');
  } catch (error) {
    next(error);
  }
};

