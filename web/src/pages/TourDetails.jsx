import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Pagination } from 'swiper/modules';
import {
  HiClock,
  HiStar,
  HiLocationMarker,
  HiCalendar,
  HiUserGroup,
  HiCheck,
  HiX,
  HiArrowRight
} from 'react-icons/hi';
import { toursAPI } from '../services/api';
import useAuthStore from '../store/authStore';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const TourDetails = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { isAuthenticated } = useAuthStore();
  const [thumbsSwiper, setThumbsSwiper] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('itinerary');

  const { data, isLoading } = useQuery(
    ['tour', slug],
    () => toursAPI.getBySlug(slug).then(res => res.data.data),
    { enabled: !!slug }
  );

  const tour = data?.tour;
  const reviews = data?.reviews || [];

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour not found</h2>
          <Link to="/tours" className="btn-primary">Browse Tours</Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'inclusions', label: 'Inclusions' },
    { id: 'reviews', label: `Reviews (${tour.totalReviews || 0})` }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Image Gallery */}
      <section className="bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <Swiper
            modules={[Navigation, Thumbs, Pagination]}
            navigation
            pagination={{ clickable: true }}
            thumbs={{ swiper: thumbsSwiper }}
            className="h-[500px]"
          >
            {(tour.images?.length > 0 ? tour.images : [{ url: 'https://images.unsplash.com/photo-1545126758-d68b8e9f6af7?w=1920' }]).map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image.url}
                  alt={image.caption || tour.title?.[lang] || tour.title?.en}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          
          {tour.images?.length > 1 && (
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={6}
              className="mt-2 h-20 px-4 pb-4"
            >
              {tour.images.map((image, index) => (
                <SwiperSlide key={index} className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                  <img
                    src={image.url}
                    alt=""
                    className="w-full h-full object-cover rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-saffron-100 text-saffron-700 px-3 py-1 rounded-full text-sm font-medium">
                  {tour.category}
                </span>
                {tour.isFeatured && (
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                    ⭐ Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
                {tour.title?.[lang] || tour.title?.en}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <span className="flex items-center">
                  <HiClock className="w-5 h-5 mr-1 text-saffron-500" />
                  {tour.duration?.days} Days / {tour.duration?.nights || tour.duration?.days - 1} Nights
                </span>
                <span className="flex items-center">
                  <HiStar className="w-5 h-5 mr-1 text-yellow-500" />
                  {tour.averageRating?.toFixed(1) || '4.5'} ({tour.totalReviews || 0} reviews)
                </span>
                <span className="flex items-center">
                  <HiUserGroup className="w-5 h-5 mr-1 text-saffron-500" />
                  Max {tour.maxGroupSize} people
                </span>
              </div>
              
              <p className="text-gray-600 leading-relaxed">
                {tour.description?.[lang] || tour.description?.en}
              </p>
            </motion.div>

            {/* Destinations */}
            {tour.destinations?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <HiLocationMarker className="w-6 h-6 mr-2 text-saffron-500" />
                  Destinations
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {tour.destinations.map((dest, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">
                        {dest.type === 'religious' ? '🛕' : dest.type === 'historic' ? '🏰' : '🎭'}
                      </span>
                      <span className="font-medium text-gray-700">{dest.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-saffron-600 border-b-2 border-saffron-500 bg-saffron-50'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Itinerary Tab */}
                {activeTab === 'itinerary' && (
                  <div className="space-y-6">
                    {tour.itinerary?.map((day, index) => (
                      <div key={index} className="relative pl-8 pb-8 border-l-2 border-saffron-200 last:pb-0">
                        <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 bg-saffron-500 rounded-full"></div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            Day {day.day}: {day.title}
                          </h3>
                          <p className="text-gray-600 mb-3">{day.description}</p>
                          
                          {day.activities?.length > 0 && (
                            <div className="space-y-1">
                              {day.activities.map((activity, i) => (
                                <div key={i} className="flex items-start">
                                  <HiCheck className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                                  <span className="text-sm text-gray-600">{activity}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {day.meals && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {day.meals.breakfast && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  🍳 Breakfast
                                </span>
                              )}
                              {day.meals.lunch && (
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                  🍱 Lunch
                                </span>
                              )}
                              {day.meals.dinner && (
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                  🍽️ Dinner
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inclusions Tab */}
                {activeTab === 'inclusions' && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <HiCheck className="w-5 h-5 text-green-500 mr-2" />
                        Included
                      </h3>
                      <ul className="space-y-2">
                        {(tour.inclusions || tour.price?.includes || []).map((item, i) => (
                          <li key={i} className="flex items-start">
                            <HiCheck className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                            <span className="text-gray-600">{item?.[lang] || item?.en || item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <HiX className="w-5 h-5 text-red-500 mr-2" />
                        Excluded
                      </h3>
                      <ul className="space-y-2">
                        {(tour.exclusions || tour.price?.excludes || []).map((item, i) => (
                          <li key={i} className="flex items-start">
                            <HiX className="w-4 h-4 text-red-500 mr-2 mt-1 flex-shrink-0" />
                            <span className="text-gray-600">{item?.[lang] || item?.en || item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review._id} className="border-b pb-6 last:border-0">
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-600 font-bold mr-3">
                              {review.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{review.user?.name}</h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <HiStar
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.ratings?.overall ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600">{review.review}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No reviews yet. Be the first to review!
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <div className="mb-4">
                <span className="text-gray-500">Starting from</span>
                <div className="flex items-baseline space-x-2">
                  {tour.price?.discountedAmount && (
                    <span className="text-xl text-gray-400 line-through">
                      ₹{tour.price.amount?.toLocaleString()}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-saffron-600">
                    ₹{(tour.price?.discountedAmount || tour.price?.amount)?.toLocaleString()}
                  </span>
                  <span className="text-gray-500">per person</span>
                </div>
              </div>

              {/* Upcoming Dates */}
              {tour.startDates?.filter(d => d.status === 'upcoming').length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <HiCalendar className="w-4 h-4 mr-1" />
                    Upcoming Dates
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {tour.startDates
                      .filter(d => d.status === 'upcoming')
                      .slice(0, 5)
                      .map((date, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
                        >
                          <span>{new Date(date.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            date.availableSeats > 10
                              ? 'bg-green-100 text-green-700'
                              : date.availableSeats > 0
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {date.availableSeats > 0 ? `${date.availableSeats} seats` : 'Full'}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {isAuthenticated ? (
                <Link
                  to={`/booking/${tour._id}`}
                  className="btn-primary w-full text-center"
                >
                  {t('common.bookNow')}
                  <HiArrowRight className="ml-2 inline" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  state={{ from: `/tours/${slug}` }}
                  className="btn-primary w-full text-center"
                >
                  Login to Book
                </Link>
              )}

              <p className="text-center text-sm text-gray-500 mt-3">
                Free cancellation up to 30 days before
              </p>

              {/* Highlights */}
              {tour.highlights?.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium text-gray-900 mb-3">Highlights</h3>
                  <ul className="space-y-2">
                    {tour.highlights.slice(0, 5).map((highlight, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <span className="text-saffron-500 mr-2">✦</span>
                        <span className="text-gray-600">{highlight?.[lang] || highlight?.en || highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;

