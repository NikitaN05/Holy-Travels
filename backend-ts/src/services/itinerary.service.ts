// Itinerary service

import prisma from '../utils/prisma.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import {
  CreateItineraryItemInput,
  UpdateItineraryItemInput,
  EmergencyAlertInput,
} from '../validators/itinerary.validators.js';
import { hasActiveBooking } from './booking.service.js';

/**
 * Get tour itinerary (public for booked travellers, always for owner)
 */
export const getTourItinerary = async (
  tourId: string,
  userId?: string,
  isOwner: boolean = false
) => {
  // Check if tour exists
  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
    select: { id: true, status: true },
  });

  if (!tour) {
    throw new NotFoundError('Tour not found');
  }

  // If not owner, check if user has an active/confirmed booking
  if (!isOwner && userId) {
    const hasBooking = await prisma.booking.findFirst({
      where: {
        userId,
        tourDate: { tourId },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (!hasBooking) {
      throw new ForbiddenError('You must book this tour to view the itinerary');
    }
  } else if (!isOwner) {
    throw new ForbiddenError('Authentication required to view itinerary');
  }

  return prisma.itineraryItem.findMany({
    where: { tourId },
    orderBy: [{ dayNumber: 'asc' }, { sortOrder: 'asc' }],
  });
};

/**
 * Create itinerary item (owner)
 */
export const createItineraryItem = async (
  tourId: string,
  data: CreateItineraryItemInput
) => {
  const tour = await prisma.tour.findUnique({ where: { id: tourId } });
  
  if (!tour) {
    throw new NotFoundError('Tour not found');
  }

  return prisma.itineraryItem.create({
    data: {
      tourId,
      dayNumber: data.dayNumber,
      title: data.title,
      description: data.description,
      scheduledTime: data.scheduledTime ? new Date(data.scheduledTime) : null,
      location: data.location,
      notes: data.notes,
      isEmergencyRelevant: data.isEmergencyRelevant,
      sortOrder: data.sortOrder,
    },
  });
};

/**
 * Update itinerary item (owner)
 */
export const updateItineraryItem = async (
  tourId: string,
  itemId: string,
  data: UpdateItineraryItemInput
) => {
  const item = await prisma.itineraryItem.findFirst({
    where: { id: itemId, tourId },
  });

  if (!item) {
    throw new NotFoundError('Itinerary item not found');
  }

  return prisma.itineraryItem.update({
    where: { id: itemId },
    data: {
      ...(data.dayNumber !== undefined && { dayNumber: data.dayNumber }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.scheduledTime !== undefined && {
        scheduledTime: data.scheduledTime ? new Date(data.scheduledTime) : null,
      }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.isEmergencyRelevant !== undefined && {
        isEmergencyRelevant: data.isEmergencyRelevant,
      }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      // Reset notification sent flag if time changed
      ...(data.scheduledTime !== undefined && { notificationSent: false }),
    },
  });
};

/**
 * Delete itinerary item (owner)
 */
export const deleteItineraryItem = async (tourId: string, itemId: string) => {
  const item = await prisma.itineraryItem.findFirst({
    where: { id: itemId, tourId },
  });

  if (!item) {
    throw new NotFoundError('Itinerary item not found');
  }

  await prisma.itineraryItem.delete({ where: { id: itemId } });
};

/**
 * Create emergency alert (owner)
 */
export const createEmergencyAlert = async (
  tourId: string,
  data: EmergencyAlertInput
) => {
  const tour = await prisma.tour.findUnique({ where: { id: tourId } });
  
  if (!tour) {
    throw new NotFoundError('Tour not found');
  }

  return prisma.emergencyAlert.create({
    data: {
      tourId,
      title: data.title,
      message: data.message,
      severity: data.severity,
    },
  });
};

/**
 * Get active emergency alerts for a tour
 */
export const getActiveAlerts = async (tourId: string) => {
  return prisma.emergencyAlert.findMany({
    where: {
      tourId,
      isActive: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Deactivate emergency alert (owner)
 */
export const deactivateAlert = async (alertId: string) => {
  return prisma.emergencyAlert.update({
    where: { id: alertId },
    data: { isActive: false },
  });
};

/**
 * Get itinerary items due for notification
 * Items scheduled within the next X minutes that haven't been notified
 */
export const getDueItineraryItems = async (minutesAhead: number = 30) => {
  const now = new Date();
  const cutoff = new Date(now.getTime() + minutesAhead * 60 * 1000);

  return prisma.itineraryItem.findMany({
    where: {
      scheduledTime: {
        gte: now,
        lte: cutoff,
      },
      notificationSent: false,
      tour: {
        tourDates: {
          some: {
            isActive: true,
          },
        },
      },
    },
    include: {
      tour: {
        include: {
          tourDates: {
            where: { isActive: true },
            include: {
              bookings: {
                where: { status: 'CONFIRMED' },
                include: { user: true },
              },
            },
          },
        },
      },
    },
  });
};

/**
 * Mark itinerary item as notified
 */
export const markItemNotified = async (itemId: string) => {
  return prisma.itineraryItem.update({
    where: { id: itemId },
    data: { notificationSent: true },
  });
};

