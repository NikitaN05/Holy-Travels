import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { HiPhotograph, HiEye, HiCalendar } from 'react-icons/hi';
import { galleryAPI } from '../services/api';

const Gallery = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { data, isLoading } = useQuery('galleryAlbums', () =>
    galleryAPI.getAll({ limit: 20 }).then(res => res.data.data)
  );

  const { data: featured } = useQuery('featuredAlbums', () =>
    galleryAPI.getFeatured().then(res => res.data.data)
  );

  const { data: categories } = useQuery('galleryCategories', () =>
    galleryAPI.getCategories().then(res => res.data.data)
  );

  const categoryIcons = {
    pilgrimage: '🛕',
    historic: '🏰',
    cultural: '🎭',
    food: '🍽️',
    group: '👥',
    scenic: '🏔️',
    events: '🎉'
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-maroon-600 to-maroon-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {t('common.gallery')}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Relive the beautiful moments from our sacred journeys
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Albums */}
        {featured?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Albums</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.slice(0, 3).map((album) => (
                <Link
                  key={album._id}
                  to={`/gallery/${album._id}`}
                  className="group relative h-80 rounded-2xl overflow-hidden"
                >
                  <img
                    src={album.coverImage || 'https://images.unsplash.com/photo-1545126758-d68b8e9f6af7?w=600'}
                    alt={album.title?.[lang] || album.title?.en}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block bg-saffron-500 text-white text-xs px-2 py-1 rounded mb-2">
                      Featured
                    </span>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {album.title?.[lang] || album.title?.en}
                    </h3>
                    <div className="flex items-center text-white/80 text-sm space-x-4">
                      <span className="flex items-center">
                        <HiPhotograph className="w-4 h-4 mr-1" />
                        {album.totalPhotos} photos
                      </span>
                      <span className="flex items-center">
                        <HiEye className="w-4 h-4 mr-1" />
                        {album.totalViews || 0} views
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Category Stats */}
        {categories?.length > 0 && (
          <section className="mb-12">
            <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="bg-white rounded-xl px-4 py-3 shadow-md flex items-center space-x-2"
                >
                  <span className="text-2xl">{categoryIcons[cat._id] || '📷'}</span>
                  <div>
                    <div className="font-semibold text-gray-900 capitalize">{cat._id}</div>
                    <div className="text-sm text-gray-500">
                      {cat.count} albums • {cat.totalPhotos} photos
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Albums Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Albums</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.albums?.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {data.albums.map((album, index) => (
                <motion.div
                  key={album._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/gallery/${album._id}`}
                    className="card card-hover block group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={album.coverImage || 'https://images.unsplash.com/photo-1545126758-d68b8e9f6af7?w=600'}
                        alt={album.title?.[lang] || album.title?.en}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded-full flex items-center">
                          {categoryIcons[album.category] || '📷'}
                          <span className="ml-1 capitalize">{album.category}</span>
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        <HiPhotograph className="w-3 h-3 inline mr-1" />
                        {album.totalPhotos}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 group-hover:text-saffron-600 transition-colors mb-1">
                        {album.title?.[lang] || album.title?.en}
                      </h3>
                      {album.tourDate && (
                        <div className="flex items-center text-gray-500 text-sm">
                          <HiCalendar className="w-4 h-4 mr-1" />
                          {new Date(album.tourDate).toLocaleDateString('en-IN', {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <HiPhotograph className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No albums yet</h3>
              <p className="text-gray-600">Check back soon for our travel memories!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Gallery;

