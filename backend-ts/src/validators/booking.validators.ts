// Booking validation schemas

import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    tourDateId: z.string().min(1, 'Tour date ID is required'),
    numberOfTravellers: z.number().int().min(1, 'At least 1 traveller required').default(1),
    contactName: z.string().min(2, 'Contact name is required'),
    contactPhone: z.string().min(10, 'Valid phone number required'),
    contactEmail: z.string().email('Valid email required'),
    specialRequests: z.string().optional(),
  }),
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
  }),
  params: z.object({
    id: z.string().min(1, 'Booking ID is required'),
  }),
});

export const bookingIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Booking ID is required'),
  }),
});

export const bookingQuerySchema = z.object({
  query: z.object({
    page: z.string().transform(Number).default('1'),
    limit: z.string().transform(Number).default('10'),
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).optional(),
    tourId: z.string().optional(),
  }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>['body'];
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>['body'];
export type BookingQuery = z.infer<typeof bookingQuerySchema>['query'];

