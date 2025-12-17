// Tour service

import prisma from '../utils/prisma.js';
import { NotFoundError } from '../utils/errors.js';
import {
  CreateTourInput,
  UpdateTourInput,
  TourQuery,
  CreateTourDateInput,
  UpdateTourDateInput,
} from '../validators/tour.validators.js';
import { TourStatus, Prisma } from '@prisma/client';

/**
 * Get all published tours (public)
 */
export const getPublicTours = async (query: TourQuery) => {
  const { page, limit, category, search, featured } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.TourWhereInput = {
    status: 'PUBLISHED',
    ...(category && { category }),
    ...(featured && { isFeatured: true }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [tours, total] = await Promise.all([
    prisma.tour.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      include: {
        tourDates: {
          where: {
            startDate: { gte: new Date() },
          },
          orderBy: { startDate: 'asc' },
          take: 3,
        },
        _count: {
          select: { photos: true },
        },
      },
    }),
    prisma.tour.count({ where }),
  ]);

  return { tours, total, page, limit };
};

/**
 * Get single tour by ID (public)
 */
export const getTourById = async (id: string) => {
  const tour = await prisma.tour.findFirst({
    where: { id, status: 'PUBLISHED' },
    include: {
      tourDates: {
        where: {
          startDate: { gte: new Date() },
        },
        orderBy: { startDate: 'asc' },
      },
      itineraryItems: {
        orderBy: [{ dayNumber: 'asc' }, { sortOrder: 'asc' }],
      },
      _count: {
        select: { photos: true },
      },
    },
  });

  if (!tour) {
    throw new NotFoundError('Tour not found');
  }

  return tour;
};

/**
 * Get featured tours (public)
 */
export const getFeaturedTours = async (limit: number = 6) => {
  return prisma.tour.findMany({
    where: {
      status: 'PUBLISHED',
      isFeatured: true,
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      tourDates: {
        where: {
          startDate: { gte: new Date() },
        },
        orderBy: { startDate: 'asc' },
        take: 1,
      },
    },
  });
};

// ==========================================
// OWNER FUNCTIONS
// ==========================================

/**
 * Get all tours (owner - includes drafts)
 */
export const getAllTours = async (query: TourQuery) => {
  const { page, limit, category, status, search } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.TourWhereInput = {
    ...(category && { category }),
    ...(status && { status: status as TourStatus }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [tours, total] = await Promise.all([
    prisma.tour.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        tourDates: true,
        _count: {
          select: { 
            itineraryItems: true, 
            photos: true,
          },
        },
      },
    }),
    prisma.tour.count({ where }),
  ]);

  return { tours, total, page, limit };
};

/**
 * Get tour by ID (owner - any status)
 */
export const getTourByIdOwner = async (id: string) => {
  const tour = await prisma.tour.findUnique({
    where: { id },
    include: {
      tourDates: {
        orderBy: { startDate: 'asc' },
        include: {
          _count: { select: { bookings: true } },
        },
      },
      itineraryItems: {
        orderBy: [{ dayNumber: 'asc' }, { sortOrder: 'asc' }],
      },
      emergencyAlerts: {
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { photos: true },
      },
    },
  });

  if (!tour) {
    throw new NotFoundError('Tour not found');
  }

  return tour;
};

/**
 * Create new tour (owner)
 */
export const createTour = async (data: CreateTourInput) => {
  return prisma.tour.create({
    data: {
      ...data,
      price: new Prisma.Decimal(data.price),
    },
  });
};

/**
 * Update tour (owner)
 */
export const updateTour = async (id: string, data: UpdateTourInput) => {
  const tour = await prisma.tour.findUnique({ where: { id } });
  
  if (!tour) {
    throw new NotFoundError('Tour not found');
  }

  return prisma.tour.update({
    where: { id },
    data: {
      ...data,
      ...(data.price && { price: new Prisma.Decimal(data.price) }),
    },
  });
};

/**
 * Delete tour (owner)
 */
export const deleteTour = async (id: string) => {
  const tour = await prisma.tour.findUnique({ where: { id } });
  
  if (!tour) {
    throw new NotFoundError('Tour not found');
  }

  await prisma.tour.delete({ where: { id } });
};

// ==========================================
// TOUR DATES
// ==========================================

/**
 * Add tour date (owner)
 */
export const addTourDate = async (tourId: string, data: CreateTourDateInput) => {
  const tour = await prisma.tour.findUnique({ where: { id: tourId } });
  
  if (!tour) {
    throw new NotFoundError('Tour not found');
  }

  return prisma.tourDate.create({
    data: {
      tourId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      availableSpots: data.availableSpots,
    },
  });
};

/**
 * Update tour date (owner)
 */
export const updateTourDate = async (
  tourId: string,
  dateId: string,
  data: UpdateTourDateInput
) => {
  const tourDate = await prisma.tourDate.findFirst({
    where: { id: dateId, tourId },
  });

  if (!tourDate) {
    throw new NotFoundError('Tour date not found');
  }

  return prisma.tourDate.update({
    where: { id: dateId },
    data: {
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
      ...(data.availableSpots !== undefined && { availableSpots: data.availableSpots }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
};

/**
 * Delete tour date (owner)
 */
export const deleteTourDate = async (tourId: string, dateId: string) => {
  const tourDate = await prisma.tourDate.findFirst({
    where: { id: dateId, tourId },
    include: { _count: { select: { bookings: true } } },
  });

  if (!tourDate) {
    throw new NotFoundError('Tour date not found');
  }

  if (tourDate._count.bookings > 0) {
    throw new Error('Cannot delete tour date with existing bookings');
  }

  await prisma.tourDate.delete({ where: { id: dateId } });
};

