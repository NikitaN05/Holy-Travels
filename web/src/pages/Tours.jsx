import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import {
  HiSearch,
  HiFilter,
  HiStar,
  HiClock,
  HiArrowRight,
  HiLocationMarker,
  HiX
} from 'react-icons/hi';
import { toursAPI } from '../services/api';

// Fallback tours data - shows when API is unavailable
const FALLBACK_TOURS = [
  {
    _id: "1",
    title: { en: "Mathura Vrindavan Divine Yatra", hi: "मथुरा वृंदावन दिव्य यात्रा" },
    slug: "mathura-vrindavan-yatra",
    shortDescription: { en: "Sacred journey to Krishna's birthplace - Mathura & Vrindavan temples" },
    category: "pilgrimage",
    duration: { days: 3, nights: 2 },
    price: { amount: 6500, currency: "INR", discountedAmount: 5500 },
    isActive: true,
    isFeatured: true,
    averageRating: 4.8,
    totalReviews: 245,
    images: [{ url: "https://images.pexels.com/photos/17376637/pexels-photo-17376637.jpeg?auto=compress&cs=tinysrgb&w=800", caption: "Banke Bihari Temple", isMain: true }]
  },
  {
    _id: "2",
    title: { en: "Dwarka Somnath Divine Darshan", hi: "द्वारका सोमनाथ दिव्य दर्शन" },
    slug: "dwarka-somnath-darshan",
    shortDescription: { en: "Sacred pilgrimage to Lord Krishna's Dwarka and first Jyotirlinga Somnath" },
    category: "pilgrimage",
    duration: { days: 5, nights: 4 },
    price: { amount: 15000, currency: "INR", discountedAmount: 13500 },
    isActive: true,
    isFeatured: true,
    averageRating: 4.9,
    totalReviews: 189,
    images: [{ url: "https://images.pexels.com/photos/6064355/pexels-photo-6064355.jpeg?auto=compress&cs=tinysrgb&w=800", caption: "Somnath Temple", isMain: true }]
  },
  {
    _id: "3",
    title: { en: "Jaipur & Khatu Shyam Ji Darshan", hi: "जयपुर और खाटू श्याम जी दर्शन" },
    slug: "jaipur-khatu-shyam-darshan",
    shortDescription: { en: "Pink City Jaipur heritage tour with Khatu Shyam Ji Temple darshan" },
    category: "mixed",
    duration: { days: 4, nights: 3 },
    price: { amount: 9500, currency: "INR", discountedAmount: 8500 },
    isActive: true,
    isFeatured: true,
    averageRating: 4.7,
    totalReviews: 156,
    images: [{ url: "https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800", caption: "Amber Fort Jaipur", isMain: true }]
  },
  {
    _id: "4",
    title: { en: "Nashik Shirdi Shani Shingnapur Yatra", hi: "नासिक शिर्डी शनि शिंगणापुर यात्रा" },
    slug: "nashik-shirdi-shani-shingnapur",
    shortDescription: { en: "Divine Maharashtra tour - Trimbakeshwar, Shirdi Sai Baba & Shani Shingnapur" },
    category: "pilgrimage",
    duration: { days: 4, nights: 3 },
    price: { amount: 7500, currency: "INR", discountedAmount: 6500 },
    isActive: true,
    isFeatured: true,
    averageRating: 4.9,
    totalReviews: 312,
    images: [{ url: "https://images.pexels.com/photos/5206729/pexels-photo-5206729.jpeg?auto=compress&cs=tinysrgb&w=800", caption: "Shirdi Sai Baba Temple", isMain: true }]
  },
  {
    _id: "5",
    title: { en: "Rameshwaram & Balaji Puram Yatra", hi: "रामेश्वरम और बालाजी पुरम यात्रा" },
    slug: "rameshwaram-balaji-puram-tirupati",
    shortDescription: { en: "Complete South India pilgrimage - Rameshwaram Char Dham & Tirupati Balaji" },
    category: "pilgrimage",
    duration: { days: 7, nights: 6 },
    price: { amount: 22000, currency: "INR", discountedAmount: 19500 },
    isActive: true,
    isFeatured: true,
    averageRating: 4.9,
    totalReviews: 278,
    images: [{ url: "https://images.pexels.com/photos/17376541/pexels-photo-17376541.jpeg?auto=compress&cs=tinysrgb&w=800", caption: "Ramanathaswamy Temple", isMain: true }]
  }
];

const Tours = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: '',
    minPrice: '',
    maxPrice: '',
    duration: '',
    sort: '-createdAt'
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: apiData, isLoading, isError } = useQuery(
    ['tours', filters],
    () => toursAPI.getAll(filters).then(res => res.data?.data || res.data),
    { 
      keepPreviousData: true,
      retry: 2,
      retryDelay: 1000,
      onError: (err) => console.log('API Error, using fallback data:', err.message)
    }
  );

  // Use API data if available, otherwise use fallback
  const data = (apiData && (Array.isArray(apiData) ? apiData.length > 0 : true)) ? apiData : FALLBACK_TOURS;

  const { data: categories } = useQuery('tourCategories', () =>
    toursAPI.getCategories().then(res => res.data.data)
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key === 'category') {
      setSearchParams(value ? { category: value } : {});
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      duration: '',
      sort: '-createdAt'
    });
    setSearchParams({});
  };

  const categoryLabels = {
    pilgrimage: { en: 'Pilgrimage Tours', hi: 'तीर्थ यात्राएं', mr: 'तीर्थयात्रा', icon: '🛕' },
    historic: { en: 'Historic Tours', hi: 'ऐतिहासिक यात्राएं', mr: 'ऐतिहासिक सहली', icon: '🏰' },
    cultural: { en: 'Cultural Tours', hi: 'सांस्कृतिक यात्राएं', mr: 'सांस्कृतिक सहली', icon: '🎭' },
    mixed: { en: 'Mixed Tours', hi: 'मिश्रित यात्राएं', mr: 'मिश्र सहली', icon: '✨' }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-saffron-600 to-primary-700 text-white py-16">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {t('common.tours')}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover our collection of spiritual, historic, and cultural journeys
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('common.search') + ' tours...'}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-transparent bg-white"
            >
              <option value="">{t('common.all')} Categories</option>
              {Object.entries(categoryLabels).map(([key, value]) => (
                <option key={key} value={key}>{value[lang] || value.en}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-transparent bg-white"
            >
              <option value="-createdAt">Newest First</option>
              <option value="price.amount">Price: Low to High</option>
              <option value="-price.amount">Price: High to Low</option>
              <option value="-averageRating">Rating</option>
              <option value="duration.days">Duration: Short</option>
              <option value="-duration.days">Duration: Long</option>
            </select>

            {/* More Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <HiFilter className="w-5 h-5 mr-2" />
              {t('common.filter')}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500"
                  placeholder="100000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (days)
                </label>
                <select
                  value={filters.duration}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 bg-white"
                >
                  <option value="">Any</option>
                  <option value="3">3 Days</option>
                  <option value="5">5 Days</option>
                  <option value="7">7 Days</option>
                  <option value="10">10+ Days</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
                >
                  <HiX className="w-4 h-4 mr-2" />
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => handleFilterChange('category', '')}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              !filters.category
                ? 'bg-saffron-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t('common.all')}
          </button>
          {Object.entries(categoryLabels).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleFilterChange('category', key)}
              className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center ${
                filters.category === key
                  ? 'bg-saffron-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{value.icon}</span>
              {value[lang] || value.en}
            </button>
          ))}
        </div>

        {/* Tours Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-56 bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-8 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (Array.isArray(data) && data.length > 0) ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {data.map((tour, index) => (
              <motion.div
                key={tour._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/tours/${tour.slug}`} className="card card-hover block group h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={tour.images?.[0]?.url || 'https://images.unsplash.com/photo-1545126758-d68b8e9f6af7?w=600'}
                      alt={tour.title?.[lang] || tour.title?.en}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        {categoryLabels[tour.category]?.icon}
                        <span className="ml-1">{categoryLabels[tour.category]?.[lang] || tour.category}</span>
                      </span>
                    </div>
                    {tour.isFeatured && (
                      <span className="absolute top-4 right-4 bg-saffron-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    )}
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                      <HiStar className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{tour.averageRating?.toFixed(1) || '4.5'}</span>
                      <span className="text-gray-500 text-sm">({tour.totalReviews || 0})</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-gray-500 text-sm mb-2 space-x-4">
                      <span className="flex items-center">
                        <HiClock className="w-4 h-4 mr-1" />
                        {tour.duration?.days}D/{tour.duration?.nights || tour.duration?.days - 1}N
                      </span>
                      {tour.destinations?.[0] && (
                        <span className="flex items-center">
                          <HiLocationMarker className="w-4 h-4 mr-1" />
                          {tour.destinations[0].name}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-saffron-600 transition-colors line-clamp-2">
                      {tour.title?.[lang] || tour.title?.en}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {tour.shortDescription?.[lang] || tour.shortDescription?.en}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <span className="text-gray-500 text-sm">Starting from</span>
                        <div className="flex items-center space-x-2">
                          {tour.price?.discountedAmount && (
                            <span className="text-gray-400 line-through text-sm">
                              ₹{tour.price.amount?.toLocaleString()}
                            </span>
                          )}
                          <span className="text-xl font-bold text-saffron-600">
                            ₹{(tour.price?.discountedAmount || tour.price?.amount)?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <span className="text-saffron-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                        View
                        <HiArrowRight className="ml-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tours found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {data?.pagination?.pages > 1 && !Array.isArray(data) && (
          <div className="flex justify-center mt-12 space-x-2">
            {[...Array(data.pagination.pages)].map((_, i) => (
              <button
                key={i}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  data.pagination.page === i + 1
                    ? 'bg-saffron-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tours;

