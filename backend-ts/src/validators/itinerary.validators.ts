// Itinerary validation schemas

import { z } from 'zod';

export const createItineraryItemSchema = z.object({
  body: z.object({
    dayNumber: z.number().int().min(1, 'Day number must be at least 1'),
    title: z.string().min(2, 'Title is required'),
    description: z.string().optional(),
    scheduledTime: z.string().datetime().optional(),
    location: z.string().optional(),
    notes: z.string().optional(),
    isEmergencyRelevant: z.boolean().default(false),
    sortOrder: z.number().int().default(0),
  }),
  params: z.object({
    id: z.string().min(1, 'Tour ID is required'),
  }),
});

export const updateItineraryItemSchema = z.object({
  body: z.object({
    dayNumber: z.number().int().min(1).optional(),
    title: z.string().min(2).optional(),
    description: z.string().optional(),
    scheduledTime: z.string().datetime().optional().nullable(),
    location: z.string().optional(),
    notes: z.string().optional(),
    isEmergencyRelevant: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Tour ID is required'),
    itemId: z.string().min(1, 'Itinerary item ID is required'),
  }),
});

export const itineraryItemIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Tour ID is required'),
    itemId: z.string().min(1, 'Itinerary item ID is required'),
  }),
});

export const emergencyAlertSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title is required'),
    message: z.string().min(5, 'Message is required'),
    severity: z.enum(['low', 'medium', 'high', 'critical']).default('high'),
  }),
  params: z.object({
    id: z.string().min(1, 'Tour ID is required'),
  }),
});

export type CreateItineraryItemInput = z.infer<typeof createItineraryItemSchema>['body'];
export type UpdateItineraryItemInput = z.infer<typeof updateItineraryItemSchema>['body'];
export type EmergencyAlertInput = z.infer<typeof emergencyAlertSchema>['body'];

