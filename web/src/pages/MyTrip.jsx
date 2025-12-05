import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import {
  HiTicket,
  HiHome,
  HiLocationMarker,
  HiCalendar,
  HiClock,
  HiMap
} from 'react-icons/hi';
import { travellersAPI } from '../services/api';

const MyTrip = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { data, isLoading, error } = useQuery('currentTrip', () =>
    travellersAPI.getCurrentTrip().then(res => res.data.data)
  );

  const { data: itinerary } = useQuery(
    'currentItinerary',
    () => travellersAPI.getItinerary().then(res => res.data.data),
    { enabled: !!data?.tour }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (error || !data?.tour) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <div className="text-6xl mb-6">✈️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Active Trip</h2>
          <p className="text-gray-600 mb-8">
            You don't have an active trip right now. Browse our tours and book your next spiritual journey!
          </p>
          <Link to="/tours" className="btn-primary">
            Browse Tours
          </Link>
        </div>
      </div>
    );
  }

  const tour = data.tour;
  const booking = data.booking;

  // Calculate current day of trip
  const today = new Date();
  const startDate = new Date(booking?.tourDate);
  const currentDay = Math.max(1, Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1);
  const currentItinerary = itinerary?.itinerary?.find(d => d.day === currentDay);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      {/* Hero Banner */}
      <section className="relative h-64 bg-gradient-to-r from-saffron-600 to-primary-700">
        {tour.images?.[0] && (
          <img
            src={tour.images[0].url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
          />
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm mb-3 inline-block">
              Day {currentDay} of {tour.duration?.days}
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              {tour.title?.[lang] || tour.title?.en}
            </h1>
            <p className="text-white/80">Booking ID: {booking?.bookingId}</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            {currentItinerary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <HiCalendar className="w-6 h-6 mr-2 text-saffron-500" />
                  Today's Schedule
                </h2>
                <div className="bg-saffron-50 rounded-xl p-4 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Day {currentItinerary.day}: {currentItinerary.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{currentItinerary.description}</p>
                  
                  {currentItinerary.activities?.length > 0 && (
                    <div className="space-y-2">
                      {currentItinerary.activities.map((activity, i) => (
                        <div key={i} className="flex items-center">
                          <span className="w-2 h-2 bg-saffron-500 rounded-full mr-3"></span>
                          <span className="text-gray-700">{activity}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {currentItinerary.places?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Places to Visit Today</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentItinerary.places.map((place, i) => (
                        <div key={i} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-2xl mr-3">
                            {place.type === 'religious' ? '🛕' : place.type === 'historic' ? '🏰' : '🎭'}
                          </span>
                          <div>
                            <span className="font-medium text-gray-900">{place.name}</span>
                            {place.visitDuration && (
                              <p className="text-sm text-gray-500">{place.visitDuration}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Full Itinerary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <HiMap className="w-6 h-6 mr-2 text-saffron-500" />
                Complete Itinerary
              </h2>
              <div className="space-y-4">
                {itinerary?.itinerary?.map((day, index) => (
                  <div
                    key={index}
                    className={`relative pl-6 pb-6 border-l-2 last:pb-0 ${
                      day.day === currentDay ? 'border-saffron-500' : 'border-gray-200'
                    }`}
                  >
                    <div className={`absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full ${
                      day.day < currentDay
                        ? 'bg-green-500'
                        : day.day === currentDay
                        ? 'bg-saffron-500 ring-4 ring-saffron-100'
                        : 'bg-gray-300'
                    }`}></div>
                    <div className={`rounded-lg p-3 ${
                      day.day === currentDay ? 'bg-saffron-50' : 'bg-gray-50'
                    }`}>
                      <h3 className="font-semibold text-gray-900">
                        Day {day.day}: {day.title}
                        {day.day === currentDay && (
                          <span className="ml-2 text-xs bg-saffron-500 text-white px-2 py-0.5 rounded-full">
                            Today
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Travel Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <HiTicket className="w-5 h-5 mr-2 text-saffron-500" />
                Travel Details
              </h3>
              
              {data.ticketNumber && (
                <div className="space-y-4">
                  <div className="bg-saffron-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Ticket Number</p>
                    <p className="font-semibold text-gray-900">{data.ticketNumber}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Platform</p>
                      <p className="font-medium">{data.platformNumber || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Coach</p>
                      <p className="font-medium">{data.coachNumber || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Seat</p>
                      <p className="font-medium">{data.seatNumber || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Station</p>
                      <p className="font-medium">{data.railwayStation || '-'}</p>
                    </div>
                  </div>
                </div>
              )}

              {!data.ticketNumber && (
                <p className="text-gray-500 text-sm">Travel details will be updated soon.</p>
              )}
            </motion.div>

            {/* Hotel Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <HiHome className="w-5 h-5 mr-2 text-saffron-500" />
                Accommodation
              </h3>
              
              {data.hotelName ? (
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="font-semibold text-gray-900">{data.hotelName}</p>
                    <p className="text-sm text-gray-600">Room: {data.roomNumber || 'TBA'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Hotel details will be updated soon.</p>
              )}
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/menu"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-saffron-50 transition-colors"
                >
                  <span className="text-2xl mr-3">🍽️</span>
                  <span className="font-medium text-gray-700">{t('nav.menu')}</span>
                </Link>
                <Link
                  to="/emergency"
                  className="flex items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <span className="text-2xl mr-3">🚨</span>
                  <span className="font-medium text-red-700">{t('nav.emergency')}</span>
                </Link>
                <Link
                  to="/polls"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <span className="text-2xl mr-3">🗳️</span>
                  <span className="font-medium text-gray-700">Vote for Next Trip</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTrip;

