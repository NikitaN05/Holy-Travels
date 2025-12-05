import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowLeft, HiHeart, HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { galleryAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const AlbumDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: album, isLoading } = useQuery(
    ['album', id],
    () => galleryAPI.getById(id).then(res => res.data.data),
    { enabled: !!id }
  );

  const likeMutation = useMutation(
    (photoId) => galleryAPI.likePhoto(id, photoId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['album', id]);
      }
    }
  );

  const handlePhotoClick = (photo, index) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : album.photos.length - 1;
    setCurrentIndex(newIndex);
    setSelectedPhoto(album.photos[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentIndex < album.photos.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedPhoto(album.photos[newIndex]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Album not found</h2>
          <Link to="/gallery" className="btn-primary">Browse Gallery</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/gallery"
            className="inline-flex items-center text-gray-600 hover:text-saffron-600 mb-4"
          >
            <HiArrowLeft className="w-5 h-5 mr-2" />
            Back to Gallery
          </Link>
          
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            {album.title?.[lang] || album.title?.en}
          </h1>
          
          {album.description && (
            <p className="text-gray-600 max-w-2xl">
              {album.description?.[lang] || album.description?.en}
            </p>
          )}
          
          <div className="flex items-center mt-4 text-sm text-gray-500 space-x-4">
            <span>{album.totalPhotos} photos</span>
            <span>•</span>
            <span>{album.totalViews} views</span>
            {album.tour && (
              <>
                <span>•</span>
                <Link to={`/tours/${album.tour?.slug}`} className="text-saffron-600 hover:underline">
                  {album.tour?.title?.en}
                </Link>
              </>
            )}
          </div>
        </motion.div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {album.photos?.map((photo, index) => (
            <motion.div
              key={photo._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className="relative group cursor-pointer aspect-square"
              onClick={() => handlePhotoClick(photo, index)}
            >
              <img
                src={photo.thumbnail || photo.url}
                alt={photo.caption?.[lang] || photo.caption?.en || ''}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg" />
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center bg-white/90 rounded-full px-2 py-1 text-sm">
                  <HiHeart className={`w-4 h-4 mr-1 ${
                    photo.likes?.includes(user?._id) ? 'text-red-500' : 'text-gray-500'
                  }`} />
                  {photo.likes?.length || 0}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {album.photos?.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No photos in this album yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-10"
            >
              <HiX className="w-8 h-8" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 text-white/80 hover:text-white p-2 z-10"
            >
              <HiChevronLeft className="w-10 h-10" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 text-white/80 hover:text-white p-2 z-10"
            >
              <HiChevronRight className="w-10 h-10" />
            </button>

            {/* Image */}
            <motion.img
              key={selectedPhoto._id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedPhoto.url}
              alt=""
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Caption & Like */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="max-w-4xl mx-auto flex items-end justify-between">
                <div>
                  {selectedPhoto.caption && (
                    <p className="text-white text-lg">
                      {selectedPhoto.caption?.[lang] || selectedPhoto.caption?.en}
                    </p>
                  )}
                  <p className="text-white/60 text-sm mt-1">
                    {currentIndex + 1} / {album.photos.length}
                  </p>
                </div>
                {isAuthenticated && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      likeMutation.mutate(selectedPhoto._id);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                      selectedPhoto.likes?.includes(user?._id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <HiHeart className="w-5 h-5" />
                    <span>{selectedPhoto.likes?.length || 0}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlbumDetails;

