import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper/modules';
import {
  HiLocationMarker,
  HiClock,
  HiStar,
  HiUserGroup,
  HiShieldCheck,
  HiHeart,
  HiArrowRight,
  HiSparkles,
  HiCheck,
  HiPhone,
  HiCalendar,
  HiGlobe,
  HiTruck,
  HiHome,
  HiBadgeCheck,
  HiPlay
} from 'react-icons/hi';
import { toursAPI, reviewsAPI } from '../services/api';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1593181520745-76e96c64a7ae?w=1920',
    title: 'Kedarnath Temple',
    subtitle: 'Experience Divine Blessings'
  },
  {
    url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920',
    title: 'Taj Mahal',
    subtitle: 'Marvel at Timeless Beauty'
  },
  {
    url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1920',
    title: 'Amber Fort',
    subtitle: 'Walk Through Royal History'
  },
  {
    url: 'https://images.unsplash.com/photo-1591018653367-2bd7bc358c69?w=1920',
    title: 'Ganga Aarti',
    subtitle: 'Feel the Spiritual Energy'
  }
];

const categoryBadgeColors = {
  pilgrimage: 'bg-orange-500',
  historic: 'bg-blue-500',
  cultural: 'bg-purple-500',
  mixed: 'bg-green-500'
};

const categoryLabels = {
  pilgrimage: 'Pilgrimage',
  historic: 'Historic',
  cultural: 'Cultural',
  mixed: 'Mixed'
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const { data: featuredTours, isLoading: toursLoading } = useQuery('featuredTours', () => 
    toursAPI.getFeatured().then(res => res.data.data),
    { retry: 1, refetchOnWindowFocus: false }
  );

  const { data: allTours } = useQuery('allToursHome', () =>
    toursAPI.getAll({ limit: 6 }).then(res => res.data.data?.tours || res.data.data),
    { retry: 1, refetchOnWindowFocus: false }
  );

  const displayTours = featuredTours?.length > 0 ? featuredTours : allTours;

  const stats = [
    { value: '50+', label: 'Curated Tours', icon: HiGlobe },
    { value: '10K+', label: 'Happy Travelers', icon: HiUserGroup },
    { value: '100+', label: 'Sacred Destinations', icon: HiLocationMarker },
    { value: '15+', label: 'Years Experience', icon: HiBadgeCheck }
  ];

  const categories = [
    {
      id: 'pilgrimage',
      title: 'Pilgrimage Tours',
      description: 'Divine journeys to sacred temples and holy sites',
      image: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=600',
      icon: '🛕',
      count: '20+ Tours',
      color: 'from-orange-500 to-amber-600'
    },
    {
      id: 'historic',
      title: 'Historic Tours',
      description: 'Explore magnificent forts, palaces & monuments',
      image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=600',
      icon: '🏰',
      count: '15+ Tours',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'cultural',
      title: 'Cultural Experiences',
      description: 'Immerse in traditions, art & authentic cuisine',
      image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600',
      icon: '🎭',
      count: '10+ Tours',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'mixed',
      title: 'Combined Tours',
      description: 'Best of spirituality and heritage in one journey',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600',
      icon: '✨',
      count: '5+ Tours',
      color: 'from-green-500 to-teal-600'
    }
  ];

  const uspFeatures = [
    {
      icon: '🛕',
      title: 'Curated Spiritual Itineraries',
      description: 'Every tour designed by experts for maximum darshan and spiritual experience',
      gradient: 'from-orange-400 to-red-500'
    },
    {
      icon: '🏨',
      title: 'Comfortable Stays',
      description: 'Clean, hygienic hotels near temples with pure vegetarian food',
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      icon: '🚌',
      title: 'Safe Transportation',
      description: 'AC buses and vehicles with experienced drivers who know the routes',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      icon: '👨‍🏫',
      title: 'Expert Guides',
      description: 'Knowledgeable guides sharing temple history and significance',
      gradient: 'from-purple-400 to-pink-500'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Sharma',
      location: 'Mumbai',
      tour: 'Char Dham Yatra',
      rating: 5,
      review: 'An incredible spiritual journey! The organization was perfect and the guides were very knowledgeable. I felt blessed throughout.',
      image: ''
    },
    {
      name: 'Priya Patel',
      location: 'Ahmedabad',
      tour: 'Dwarka Somnath Tour',
      rating: 5,
      review: 'Best travel experience ever. The hospitality was amazing and food was delicious. Will definitely travel again with Sacred Journeys.',
      image: ''
    },
    {
      name: 'Amit Kumar',
      location: 'Delhi',
      tour: 'Golden Triangle Tour',
      rating: 5,
      review: 'Very well organized tour. Everything was taken care of - from pickup to hotels to darshan. Highly recommended!',
      image: ''
    },
    {
      name: 'Sunita Devi',
      location: 'Jaipur',
      tour: 'Varanasi Spiritual Tour',
      rating: 5,
      review: 'The Ganga Aarti experience was divine. Our guide explained everything beautifully. Felt very safe throughout.',
      image: ''
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Enhanced */}
      <section className="relative h-screen min-h-[750px]">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="absolute inset-0"
          onSlideChange={(swiper) => setActiveHeroIndex(swiper.realIndex)}
        >
          {heroImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${image.url})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6"
              >
                <HiSparkles className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-white/90 text-sm font-medium">Trusted by 10,000+ Pilgrims & Travelers</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-4 leading-tight">
                Discover{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-yellow-400">
                  Spiritual
                </span>{' '}
                &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  Historic
                </span>
                <br />Journeys Across India
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-2xl">
                From sacred temples to magnificent forts, embark on life-changing journeys with expert guidance and complete peace of mind.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link 
                  to="/tours" 
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-saffron-500 to-orange-500 text-white font-bold rounded-xl hover:from-saffron-600 hover:to-orange-600 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
                >
                  Explore Tours
                  <HiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                >
                  <HiPhone className="mr-2 w-5 h-5" />
                  Plan My Yatra
                </Link>
              </div>

              {/* Quick Category Pills */}
              <div className="flex flex-wrap gap-3">
                {['pilgrimage', 'historic', 'cultural', 'mixed'].map((cat) => (
                  <Link
                    key={cat}
                    to={`/tours?category=${cat}`}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm hover:bg-white/20 transition-all hover:scale-105"
                  >
                    {categoryLabels[cat]} Tours →
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Stats Strip */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-saffron-400" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-white/70 rounded-full" 
            />
          </div>
        </motion.div>
      </section>

      {/* Categories Section - Modern Cards */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-saffron-100 text-saffron-700 rounded-full text-sm font-medium mb-4">
              CHOOSE YOUR JOURNEY
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Discover Your Perfect Tour
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From sacred pilgrimages to historic explorations, find the journey that speaks to your soul
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={itemVariants}>
                <Link
                  to={`/tours?category=${category.id}`}
                  className="group block relative h-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <img
                    src={category.image}
                    alt={category.title}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80 group-hover:opacity-90 transition-opacity`} />
                  
                  <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl">
                      {category.icon}
                    </div>
                    <div>
                      <span className="text-white/80 text-sm">{category.count}</span>
                      <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 transition-transform">
                        {category.title}
                      </h3>
                      <p className="text-white/90 text-sm mb-3">{category.description}</p>
                      <span className="inline-flex items-center text-sm font-semibold group-hover:gap-2 transition-all">
                        Explore <HiArrowRight className="ml-1 group-hover:translate-x-2 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Tours - Dynamic Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          >
            <div>
              <span className="inline-block px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
                POPULAR TOURS
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-2">
                Featured Journeys
              </h2>
              <p className="text-xl text-gray-600">Most loved spiritual and heritage tours</p>
            </div>
            <Link 
              to="/tours" 
              className="mt-4 md:mt-0 inline-flex items-center text-saffron-600 font-semibold hover:text-saffron-700 group"
            >
              View All Tours 
              <HiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {toursLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-3xl h-96"></div>
              ))}
            </div>
          ) : displayTours && displayTours.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {displayTours.slice(0, 6).map((tour) => (
                <motion.div key={tour._id} variants={itemVariants}>
                  <Link 
                    to={`/tours/${tour.slug}`} 
                    className="group block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={tour.images?.[0]?.url || 'https://images.unsplash.com/photo-1545126758-d68b8e9f6af7?w=600'}
                        alt={tour.title?.[lang] || tour.title?.en}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Category Badge */}
                      <span className={`absolute top-4 left-4 ${categoryBadgeColors[tour.category] || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide`}>
                        {categoryLabels[tour.category] || tour.category}
                      </span>
                      
                      {/* Rating */}
                      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-lg">
                        <HiStar className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-gray-900">{tour.averageRating?.toFixed(1) || '4.5'}</span>
                        <span className="text-gray-500 text-sm">({tour.totalReviews || 0})</span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
                        <span className="flex items-center">
                          <HiClock className="w-4 h-4 mr-1" />
                          {tour.duration?.days}D/{tour.duration?.nights || tour.duration?.days - 1}N
                        </span>
                        <span className="flex items-center">
                          <HiUserGroup className="w-4 h-4 mr-1" />
                          Max {tour.maxGroupSize}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-saffron-600 transition-colors line-clamp-2">
                        {tour.title?.[lang] || tour.title?.en}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {tour.shortDescription?.[lang] || tour.shortDescription?.en || tour.description?.[lang]?.substring(0, 100) || tour.description?.en?.substring(0, 100)}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <span className="text-gray-500 text-sm">Starting from</span>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-saffron-600">
                              ₹{(tour.price?.discountedAmount || tour.price?.amount)?.toLocaleString()}
                            </p>
                            {tour.price?.discountedAmount && tour.price?.amount > tour.price?.discountedAmount && (
                              <span className="text-gray-400 line-through text-sm">
                                ₹{tour.price?.amount?.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="inline-flex items-center justify-center w-12 h-12 bg-saffron-100 text-saffron-600 rounded-full group-hover:bg-saffron-600 group-hover:text-white transition-all">
                          <HiArrowRight className="w-5 h-5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-3xl">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <HiLocationMarker className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No tours available yet</h3>
              <p className="text-gray-500">Check back soon for exciting tour packages!</p>
            </div>
          )}

          {displayTours && displayTours.length > 0 && (
            <div className="text-center mt-12">
              <Link 
                to="/tours" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-saffron-500 to-orange-500 text-white font-bold rounded-xl hover:from-saffron-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                View All Tours
                <HiArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Travel With Us - Modern USP */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-white/10 text-saffron-400 rounded-full text-sm font-medium mb-4">
              WHY CHOOSE US
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Travel With <span className="text-saffron-400">Complete Peace of Mind</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              15+ years of expertise in organizing pilgrimage and heritage tours across India
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {uspFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-3xl shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-400"
          >
            {[
              { icon: HiShieldCheck, text: '100% Safe & Secure' },
              { icon: HiHeart, text: 'Pure Vegetarian Food' },
              { icon: HiPhone, text: '24/7 Support' },
              { icon: HiBadgeCheck, text: 'Verified Hotels' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <item.icon className="w-5 h-5 text-saffron-400" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section - Clean Carousel */}
      <section className="py-20 bg-gradient-to-br from-saffron-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-saffron-100 text-saffron-700 rounded-full text-sm font-medium mb-4">
              TESTIMONIALS
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Hear From Our <span className="text-saffron-600">Happy Travelers</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real experiences from pilgrims and travelers who journeyed with us
            </p>
          </motion.div>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            className="pb-12"
          >
            {testimonials.map((review, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 h-full">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <HiStar
                        key={i}
                        className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic">
                    "{review.review}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-saffron-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{review.name}</h4>
                      <p className="text-gray-500 text-sm">{review.tour} • {review.location}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA Section - Bold & Engaging */}
      <section className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1591018653367-2bd7bc358c69?w=1920)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-saffron-600/95 to-orange-600/95" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Ready to Begin Your Sacred Journey?
            </h2>
            <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of pilgrims who have experienced divine blessings and unforgettable memories with Sacred Journeys
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/tours" 
                className="inline-flex items-center px-8 py-4 bg-white text-saffron-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <HiLocationMarker className="mr-2 w-5 h-5" />
                Browse All Tours
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold rounded-xl hover:bg-white/20 transition-all"
              >
                <HiPhone className="mr-2 w-5 h-5" />
                Contact Us
              </Link>
            </div>
            
            {/* Quick Contact */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/90">
              <a href="tel:+919876543210" className="flex items-center hover:text-white transition-colors">
                <HiPhone className="w-5 h-5 mr-2" />
                +91 98765 43210
              </a>
              <span className="flex items-center">
                <HiCalendar className="w-5 h-5 mr-2" />
                Open 7 Days a Week
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
