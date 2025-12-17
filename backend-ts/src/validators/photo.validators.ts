// Photo validation schemas

import { z } from 'zod';

export const uploadPhotoSchema = z.object({
  body: z.object({
    caption: z.string().max(500).optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Tour ID is required'),
  }),
});

export const photoQuerySchema = z.object({
  query: z.object({
    page: z.string().transform(Number).default('1'),
    limit: z.string().transform(Number).default('20'),
  }),
  params: z.object({
    id: z.string().min(1, 'Tour ID is required'),
  }),
});

export type UploadPhotoInput = z.infer<typeof uploadPhotoSchema>['body'];
export type PhotoQuery = z.infer<typeof photoQuerySchema>['query'];

