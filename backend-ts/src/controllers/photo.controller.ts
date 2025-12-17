// Photo controller

import { Request, Response, NextFunction } from 'express';
import * as photoService from '../services/photo.service.js';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated } from '../utils/response.js';
import { BadRequestError } from '../utils/errors.js';

/**
 * Upload photo
 * POST /tours/:id/photos
 */
export const uploadPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new BadRequestError('No image file provided');
    }

    const photo = await photoService.uploadTourPhoto(
      req.user!.userId,
      req.params.id,
      req.file.buffer,
      req.body.caption
    );

    sendCreated(res, { photo }, 'Photo uploaded successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get tour photos
 * GET /tours/:id/photos
 */
export const getTourPhotos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isOwner = req.user?.role === 'OWNER';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await photoService.getTourPhotos(
      req.params.id,
      req.user?.userId,
      isOwner,
      page,
      limit
    );

    sendPaginated(res, result.photos, result.page, result.limit, result.total);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete photo
 * DELETE /photos/:id
 */
export const deletePhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isOwner = req.user?.role === 'OWNER';
    await photoService.deletePhoto(req.params.id, req.user!.userId, isOwner);
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle photo approval (owner only)
 * PATCH /owner/photos/:id/approval
 */
export const toggleApproval = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const photo = await photoService.togglePhotoApproval(req.params.id);
    sendSuccess(res, { photo }, 'Photo approval toggled');
  } catch (error) {
    next(error);
  }
};

