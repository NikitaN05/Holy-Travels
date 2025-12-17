// Socket.IO configuration

import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';
import prisma from '../utils/prisma.js';
import { JwtPayload } from '../middleware/auth.middleware.js';

let io: Server | null = null;

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

/**
 * Initialize Socket.IO server
 */
export const initializeSocketIO = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: config.cors.frontendUrl,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, role: true, isActive: true },
      });

      if (!user || !user.isActive) {
        return next(new Error('User not found'));
      }

      socket.userId = user.id;
      socket.userRole = user.role;
      next();
    } catch (error) {
      logger.error({ error }, 'Socket authentication failed');
      next(new Error('Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', async (socket: AuthenticatedSocket) => {
    logger.info({ userId: socket.userId }, 'Socket connected');

    // Join user's personal room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Join tour rooms for active bookings
    if (socket.userId && socket.userRole === 'TRAVELLER') {
      const activeBookings = await prisma.booking.findMany({
        where: {
          userId: socket.userId,
          status: 'CONFIRMED',
          tourDate: { isActive: true },
        },
        include: {
          tourDate: { select: { tourId: true } },
        },
      });

      for (const booking of activeBookings) {
        socket.join(`tour:${booking.tourDate.tourId}`);
        logger.debug({ 
          userId: socket.userId, 
          tourId: booking.tourDate.tourId 
        }, 'Joined tour room');
      }
    }

    // Owner joins all tour rooms
    if (socket.userRole === 'OWNER') {
      const tours = await prisma.tour.findMany({
        where: {
          tourDates: {
            some: { isActive: true },
          },
        },
        select: { id: true },
      });

      for (const tour of tours) {
        socket.join(`tour:${tour.id}`);
      }
    }

    // Handle joining specific tour room
    socket.on('join:tour', async (tourId: string) => {
      if (!socket.userId) return;

      // Verify user has access to this tour
      const hasAccess = socket.userRole === 'OWNER' || await prisma.booking.findFirst({
        where: {
          userId: socket.userId,
          tourDate: { tourId },
          status: 'CONFIRMED',
        },
      });

      if (hasAccess) {
        socket.join(`tour:${tourId}`);
        socket.emit('joined:tour', { tourId });
        logger.debug({ userId: socket.userId, tourId }, 'Joined tour room');
      }
    });

    // Handle leaving tour room
    socket.on('leave:tour', (tourId: string) => {
      socket.leave(`tour:${tourId}`);
      logger.debug({ userId: socket.userId, tourId }, 'Left tour room');
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      logger.info({ userId: socket.userId, reason }, 'Socket disconnected');
    });

    // Ping handler for connection testing
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });

  logger.info('Socket.IO initialized');
  return io;
};

/**
 * Get Socket.IO instance
 */
export const getSocketIO = (): Server | null => io;

/**
 * Emit to specific user
 */
export const emitToUser = (userId: string, event: string, data: unknown): void => {
  io?.to(`user:${userId}`).emit(event, data);
};

/**
 * Emit to all users in a tour
 */
export const emitToTour = (tourId: string, event: string, data: unknown): void => {
  io?.to(`tour:${tourId}`).emit(event, data);
};

/**
 * Emit to all connected clients
 */
export const emitToAll = (event: string, data: unknown): void => {
  io?.emit(event, data);
};

