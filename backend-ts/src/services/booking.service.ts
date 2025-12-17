// Booking service

import prisma from '../utils/prisma.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { CreateBookingInput, BookingQuery, UpdateBookingStatusInput } from '../validators/booking.validators.js';
import { BookingStatus, Prisma } from '@prisma/client';
import { toPublicUser } from '../utils/userSanitizer.js';

/**
 * Create a new booking (traveller)
 */
export const createBooking = async (userId: string, data: CreateBookingInput) => {
  // Get tour date with tour info
  const tourDate = await prisma.tourDate.findUnique({
    where: { id: data.tourDateId },
    include: { tour: true },
  });

  if (!tourDate) {
    throw new NotFoundError('Tour date not found');
  }

  if (tourDate.tour.status !== 'PUBLISHED') {
    throw new BadRequestError('This tour is not available for booking');
  }

  // Check available spots
  const availableSpots = tourDate.availableSpots - tourDate.bookedSpots;
  if (availableSpots < data.numberOfTravellers) {
    throw new BadRequestError(`Only ${availableSpots} spots available`);
  }

  // Check if tour date is in the future
  if (tourDate.startDate <= new Date()) {
    throw new BadRequestError('Cannot book a tour that has already started');
  }

  // Calculate total amount
  const totalAmount = tourDate.tour.price.mul(data.numberOfTravellers);

  // Create booking and update booked spots in transaction
  const booking = await prisma.$transaction(async (tx) => {
    // Update booked spots
    await tx.tourDate.update({
      where: { id: data.tourDateId },
      data: { bookedSpots: { increment: data.numberOfTravellers } },
    });

    // Create booking
    return tx.booking.create({
      data: {
        userId,
        tourDateId: data.tourDateId,
        numberOfTravellers: data.numberOfTravellers,
        totalAmount,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        specialRequests: data.specialRequests,
        status: 'PENDING',
      },
      include: {
        tourDate: {
          include: { tour: true },
        },
      },
    });
  });

  return booking;
};

/**
 * Get user's bookings (traveller)
 */
export const getUserBookings = async (userId: string, query: BookingQuery) => {
  const { page, limit, status } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.BookingWhereInput = {
    userId,
    ...(status && { status: status as BookingStatus }),
  };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        tourDate: {
          include: {
            tour: {
              select: {
                id: true,
                title: true,
                subtitle: true,
                images: true,
                durationDays: true,
                category: true,
              },
            },
          },
        },
      },
    }),
    prisma.booking.count({ where }),
  ]);

  return { bookings, total, page, limit };
};

/**
 * Get single booking (traveller - own booking only)
 */
export const getBookingById = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
    include: {
      tourDate: {
        include: {
          tour: {
            include: {
              itineraryItems: {
                orderBy: [{ dayNumber: 'asc' }, { sortOrder: 'asc' }],
              },
            },
          },
        },
      },
    },
  });

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  return booking;
};

/**
 * Cancel booking (traveller)
 */
export const cancelBooking = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
    include: { tourDate: true },
  });

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.status === 'CANCELLED') {
    throw new BadRequestError('Booking is already cancelled');
  }

  // Check if tour has started
  if (booking.tourDate.startDate <= new Date()) {
    throw new BadRequestError('Cannot cancel a booking for a tour that has started');
  }

  // Update booking and release spots
  return prisma.$transaction(async (tx) => {
    // Release spots
    await tx.tourDate.update({
      where: { id: booking.tourDateId },
      data: { bookedSpots: { decrement: booking.numberOfTravellers } },
    });

    // Cancel booking
    return tx.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });
  });
};

// ==========================================
// OWNER FUNCTIONS
// ==========================================

/**
 * Get all bookings (owner)
 */
export const getAllBookings = async (query: BookingQuery) => {
  const { page, limit, status, tourId } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.BookingWhereInput = {
    ...(status && { status: status as BookingStatus }),
    ...(tourId && { tourDate: { tourId } }),
  };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        tourDate: {
          include: {
            tour: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    }),
    prisma.booking.count({ where }),
  ]);

  // Sanitize user data - owner can see private info
  const sanitizedBookings = bookings.map((b) => ({
    ...b,
    user: {
      id: b.user.id,
      fullName: b.user.fullName,
      displayName: b.user.displayName,
      email: b.user.email,
      phone: b.user.phone,
    },
  }));

  return { bookings: sanitizedBookings, total, page, limit };
};

/**
 * Update booking status (owner)
 */
export const updateBookingStatus = async (
  bookingId: string,
  data: UpdateBookingStatusInput
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  const updateData: Prisma.BookingUpdateInput = {
    status: data.status,
  };

  if (data.status === 'CONFIRMED' && booking.status !== 'CONFIRMED') {
    updateData.confirmedAt = new Date();
  } else if (data.status === 'CANCELLED' && booking.status !== 'CANCELLED') {
    updateData.cancelledAt = new Date();
    
    // Release spots when cancelling
    await prisma.tourDate.update({
      where: { id: booking.tourDateId },
      data: { bookedSpots: { decrement: booking.numberOfTravellers } },
    });
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: updateData,
    include: {
      tourDate: {
        include: { tour: true },
      },
    },
  });
};

/**
 * Check if user has an active booking for a tour
 */
export const hasActiveBooking = async (userId: string, tourId: string): Promise<boolean> => {
  const booking = await prisma.booking.findFirst({
    where: {
      userId,
      status: 'CONFIRMED',
      tourDate: {
        tourId,
        isActive: true,
      },
    },
  });

  return !!booking;
};

/**
 * Get users with active bookings for a tour (for notifications)
 */
export const getActiveTravellers = async (tourId: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      status: 'CONFIRMED',
      tourDate: {
        tourId,
        isActive: true,
      },
    },
    include: {
      user: true,
    },
  });

  return bookings.map((b) => ({
    userId: b.user.id,
    email: b.user.email,
    fullName: b.user.fullName,
  }));
};

