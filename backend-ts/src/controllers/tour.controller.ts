// Tour controller

import { Request, Response, NextFunction } from 'express';
import * as tourService from '../services/tour.service.js';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated } from '../utils/response.js';

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

/**
 * Get all published tours
 * GET /tours
 */
export const getTours = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      category: req.query.category as string,
      search: req.query.search as string,
      featured: req.query.featured === 'true',
    };

    const result = await tourService.getPublicTours(query);
    sendPaginated(res, result.tours, result.page, result.limit, result.total);
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured tours
 * GET /tours/featured
 */
export const getFeaturedTours = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const tours = await tourService.getFeaturedTours(limit);
    sendSuccess(res, { tours });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single tour
 * GET /tours/:id
 */
export const getTour = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tour = await tourService.getTourById(req.params.id);
    sendSuccess(res, { tour });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// OWNER ENDPOINTS
// ==========================================

/**
 * Get all tours (including drafts)
 * GET /owner/tours
 */
export const getOwnerTours = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      category: req.query.category as string,
      status: req.query.status as string,
      search: req.query.search as string,
    };

    const result = await tourService.getAllTours(query);
    sendPaginated(res, result.tours, result.page, result.limit, result.total);
  } catch (error) {
    next(error);
  }
};

/**
 * Get tour by ID (owner)
 * GET /owner/tours/:id
 */
export const getOwnerTour = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tour = await tourService.getTourByIdOwner(req.params.id);
    sendSuccess(res, { tour });
  } catch (error) {
    next(error);
  }
};

/**
 * Create tour
 * POST /owner/tours
 */
export const createTour = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tour = await tourService.createTour(req.body);
    sendCreated(res, { tour }, 'Tour created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update tour
 * PATCH /owner/tours/:id
 */
export const updateTour = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tour = await tourService.updateTour(req.params.id, req.body);
    sendSuccess(res, { tour }, 'Tour updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete tour
 * DELETE /owner/tours/:id
 */
export const deleteTour = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await tourService.deleteTour(req.params.id);
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
};

// ==========================================
// TOUR DATES
// ==========================================

/**
 * Add tour date
 * POST /owner/tours/:id/dates
 */
export const addTourDate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tourDate = await tourService.addTourDate(req.params.id, req.body);
    sendCreated(res, { tourDate }, 'Tour date added');
  } catch (error) {
    next(error);
  }
};

/**
 * Update tour date
 * PATCH /owner/tours/:id/dates/:dateId
 */
export const updateTourDate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tourDate = await tourService.updateTourDate(
      req.params.id,
      req.params.dateId,
      req.body
    );
    sendSuccess(res, { tourDate }, 'Tour date updated');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete tour date
 * DELETE /owner/tours/:id/dates/:dateId
 */
export const deleteTourDate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await tourService.deleteTourDate(req.params.id, req.params.dateId);
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
};

