// Tour validation schemas

import { z } from 'zod';

export const createTourSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    subtitle: z.string().optional(),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    durationDays: z.number().int().min(1, 'Duration must be at least 1 day'),
    price: z.number().positive('Price must be positive'),
    currency: z.string().default('INR'),
    locations: z.array(z.string()).default([]),
    images: z.array(z.string().url()).default([]),
    highlights: z.array(z.string()).default([]),
    inclusions: z.array(z.string()).default([]),
    exclusions: z.array(z.string()).default([]),
    terms: z.string().optional(),
    maxGroupSize: z.number().int().min(1).default(20),
    difficulty: z.enum(['easy', 'moderate', 'challenging']).default('moderate'),
    category: z.enum(['pilgrimage', 'historic', 'cultural', 'mixed']).default('pilgrimage'),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
    isFeatured: z.boolean().default(false),
  }),
});

export const updateTourSchema = z.object({
  body: createTourSchema.shape.body.partial(),
  params: z.object({
    id: z.string().min(1, 'Tour ID is required'),
  }),
});

export const tourIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Tour ID is required'),
  }),
});

export const tourQuerySchema = z.object({
  query: z.object({
    page: z.string().transform(Number).default('1'),
    limit: z.string().transform(Number).default('10'),
    category: z.enum(['pilgrimage', 'historic', 'cultural', 'mixed']).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    search: z.string().optional(),
    featured: z.string().transform(v => v === 'true').optional(),
  }),
});

// Tour Date schemas
export const createTourDateSchema = z.object({
  body: z.object({
    startDate: z.string().datetime('Invalid start date'),
    endDate: z.string().datetime('Invalid end date'),
    availableSpots: z.number().int().min(1, 'Must have at least 1 spot'),
  }),
  params: z.object({
    id: z.string().min(1, 'Tour ID is required'),
  }),
});

export const updateTourDateSchema = z.object({
  body: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    availableSpots: z.number().int().min(1).optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Tour ID is required'),
    dateId: z.string().min(1, 'Tour date ID is required'),
  }),
});

export type CreateTourInput = z.infer<typeof createTourSchema>['body'];
export type UpdateTourInput = z.infer<typeof updateTourSchema>['body'];
export type TourQuery = z.infer<typeof tourQuerySchema>['query'];
export type CreateTourDateInput = z.infer<typeof createTourDateSchema>['body'];
export type UpdateTourDateInput = z.infer<typeof updateTourDateSchema>['body'];

