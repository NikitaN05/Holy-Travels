// Photo upload service with Cloudinary

import { v2 as cloudinary } from 'cloudinary';
import prisma from '../utils/prisma.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors.js';
import { config } from '../config/index.js';
import { hasActiveBooking } from './booking.service.js';

// Configure Cloudinary
if (config.cloudinary.cloudName) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
}

export interface UploadResult {
  url: string;
  publicId: string;
}

/**
 * Upload image to Cloudinary
 */
export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string = 'holy-travels'
): Promise<UploadResult> => {
  if (!config.cloudinary.cloudName) {
    throw new BadRequestError('Cloudinary is not configured');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1920, height: 1080, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(new BadRequestError('Failed to upload image'));
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Delete image from Cloudinary
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  if (!config.cloudinary.cloudName) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
};

/**
 * Upload photo for a tour (traveller - must have active booking)
 */
export const uploadTourPhoto = async (
  userId: string,
  tourId: string,
  buffer: Buffer,
  caption?: string
) => {
  // Check if tour exists
  const tour = await prisma.tour.findUnique({ where: { id: tourId } });
  if (!tour) {
    throw new NotFoundError('Tour not found');
  }

  // Check if user has an active booking
  const hasBooking = await hasActiveBooking(userId, tourId);
  if (!hasBooking) {
    throw new ForbiddenError('You must have an active booking to upload photos');
  }

  // Upload to Cloudinary
  const { url, publicId } = await uploadToCloudinary(buffer, `holy-travels/${tourId}`);

  // Save to database
  return prisma.photo.create({
    data: {
      userId,
      tourId,
      url,
      publicId,
      caption,
    },
  });
};

/**
 * Get tour photos (owner sees all, traveller sees own)
 */
export const getTourPhotos = async (
  tourId: string,
  userId?: string,
  isOwner: boolean = false,
  page: number = 1,
  limit: number = 20
) => {
  const skip = (page - 1) * limit;

  const where = {
    tourId,
    ...(!isOwner && userId && { userId }), // Travellers only see their own
    isApproved: true,
  };

  const [photos, total] = await Promise.all([
    prisma.photo.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    }),
    prisma.photo.count({ where }),
  ]);

  return { photos, total, page, limit };
};

/**
 * Delete photo (owner or own photo)
 */
export const deletePhoto = async (
  photoId: string,
  userId: string,
  isOwner: boolean = false
) => {
  const photo = await prisma.photo.findUnique({
    where: { id: photoId },
  });

  if (!photo) {
    throw new NotFoundError('Photo not found');
  }

  // Check permission
  if (!isOwner && photo.userId !== userId) {
    throw new ForbiddenError('You can only delete your own photos');
  }

  // Delete from Cloudinary
  if (photo.publicId) {
    await deleteFromCloudinary(photo.publicId);
  }

  // Delete from database
  await prisma.photo.delete({ where: { id: photoId } });
};

/**
 * Toggle photo approval (owner)
 */
export const togglePhotoApproval = async (photoId: string) => {
  const photo = await prisma.photo.findUnique({
    where: { id: photoId },
  });

  if (!photo) {
    throw new NotFoundError('Photo not found');
  }

  return prisma.photo.update({
    where: { id: photoId },
    data: { isApproved: !photo.isApproved },
  });
};

