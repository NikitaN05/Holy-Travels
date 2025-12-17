// Notification validation schemas

import { z } from 'zod';

export const notificationQuerySchema = z.object({
  query: z.object({
    page: z.string().transform(Number).default('1'),
    limit: z.string().transform(Number).default('20'),
    unreadOnly: z.string().transform(v => v === 'true').optional(),
  }),
});

export const markReadSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Notification ID is required'),
  }),
});

export type NotificationQuery = z.infer<typeof notificationQuerySchema>['query'];

