import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiLocationMarker,
  HiClock,
  HiStar,
  HiUserGroup,
  HiArrowRight,
  HiPhone,
  HiShieldCheck,
  HiCheckCircle,
  HiSparkles
} from 'react-icons/hi';

const Home = () => {
  const popularTours = [
    {
      id: 1,
      title: 'Char Dham Yatra',
      image: 'https://images.pexels.com/photos/14660727/pexels-photo-14660727.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '12 Days',
      price: '45,999',
      rating: 4.9,
      reviews: 256,
      category: 'Pilgrimage',
      destinations: 'Yamunotri, Gangotri, Kedarnath, Badrinath'
    },
    {
      id: 2,
      title: 'Ayodhya Ram Mandir Darshan',
      image: 'https://images.pexels.com/photos/15351642/pexels-photo-15351642.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '3 Days',
      price: '8,999',
      rating: 4.8,
      reviews: 412,
      category: 'Pilgrimage',
      destinations: 'Ram Mandir, Hanuman Garhi, Saryu Ghat'
    },
    {
      id: 3,
      title: 'Golden Triangle Tour',
      image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '6 Days',
      price: '24,999',
      rating: 4.7,
      reviews: 328,
      category: 'Historic',
      destinations: 'Delhi, Agra, Jaipur'
    },
    {
      id: 4,
      title: 'Varanasi Spiritual Experience',
      image: 'https://images.pexels.com/photos/5458388/pexels-photo-5458388.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '4 Days',
      price: '12,999',
      rating: 4.9,
      reviews: 189,
      category: 'Pilgrimage',
      destinations: 'Kashi Vishwanath, Ganga Aarti, Sarnath'
    },
    {
      id: 5,
      title: 'Mathura Vrindavan Tour',
      image: 'https://images.pexels.com/photos/6064423/pexels-photo-6064423.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '3 Days',
      price: '9,999',
      rating: 4.8,
      reviews: 276,
      category: 'Pilgrimage',
      destinations: 'Krishna Janmabhoomi, Banke Bihari, ISKCON'
    },
    {
      id: 6,
      title: 'Rajasthan Heritage Tour',
      image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '8 Days',
      price: '32,999',
      rating: 4.7,
      reviews: 198,
      category: 'Historic',
      destinations: 'Jaipur, Jodhpur, Udaipur, Jaisalmer'
    }
  ];

  const features = [
    {
      icon: '🛕',
      title: 'Curated Sacred Itineraries',
      description: 'Expert-designed tours for meaningful spiritual experiences'
    },
    {
      icon: '🏨',
      title: 'Quality Accommodations',
      description: 'Clean, comfortable stays near temples and attractions'
    },
    {
      icon: '🚌',
      title: 'Safe Transportation',
      description: 'AC vehicles with experienced drivers throughout your journey'
    },
    {
      icon: '🍽️',
      title: 'Pure Vegetarian Meals',
      description: 'Hygienic, delicious vegetarian food included'
    }
  ];

  const stats = [
    { number: '50+', label: 'Tour Packages' },
    { number: '10,000+', label: 'Happy Travelers' },
    { number: '100+', label: 'Destinations' },
    { number: '15+', label: 'Years Experience' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Clean & Clear */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center bg-gray-900">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="India Travel"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center bg-orange-500 px-4 py-2 rounded-full mb-6">
              <HiSparkles className="w-5 h-5 text-white mr-2" />
              <span className="text-white font-semibold text-sm">Trusted by 10,000+ Travelers</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
              Explore India's{' '}
              <span className="text-orange-400">Sacred</span> &{' '}
              <span className="text-orange-400">Historic</span>{' '}
              Destinations
            </h1>

            {/* Subheading */}
            <p className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              Join our expertly curated pilgrimage and heritage tours. 
              Experience divine temples, magnificent forts, and rich cultural heritage 
              with complete comfort and safety.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                to="/tours"
                className="inline-flex items-center px-6 lg:px-8 py-3 lg:py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                Explore Tours
                <HiArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center px-6 lg:px-8 py-3 lg:py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                <HiPhone className="mr-2 w-5 h-5" />
                Call: +91 98765 43210
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-8 p-4 lg:p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-orange-400">{stat.number}</div>
                  <div className="text-gray-300 text-xs lg:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tour Categories - Simple & Clear */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Journey Type
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Whether you seek spiritual enlightenment or historical exploration, we have the perfect tour for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pilgrimage Tours */}
            <Link
              to="/tours?category=pilgrimage"
              className="group relative h-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
            >
              <img
                src="https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Pilgrimage Tours"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/90 via-orange-800/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="text-5xl mb-3 block">🛕</span>
                <h3 className="text-2xl font-bold mb-2">Pilgrimage Tours</h3>
                <p className="text-orange-100 mb-3">Sacred temples, holy rivers & divine experiences</p>
                <span className="inline-flex items-center text-orange-300 font-semibold group-hover:text-white transition-colors">
                  Explore Tours <HiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>

            {/* Historic Tours */}
            <Link
              to="/tours?category=historic"
              className="group relative h-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
            >
              <img
                src="https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Historic Tours"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-800/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="text-5xl mb-3 block">🏰</span>
                <h3 className="text-2xl font-bold mb-2">Historic Tours</h3>
                <p className="text-blue-100 mb-3">Majestic forts, palaces & ancient monuments</p>
                <span className="inline-flex items-center text-blue-300 font-semibold group-hover:text-white transition-colors">
                  Explore Tours <HiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Tours */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Popular Tour Packages
              </h2>
              <p className="text-gray-600 text-lg">
                Most loved tours by our travelers
              </p>
            </div>
            <Link
              to="/tours"
              className="mt-4 sm:mt-0 inline-flex items-center text-orange-600 font-semibold hover:text-orange-700"
            >
              View All Tours <HiArrowRight className="ml-2" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularTours.map((tour) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white ${
                    tour.category === 'Pilgrimage' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {tour.category}
                  </span>
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center">
                    <HiStar className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-bold text-gray-900">{tour.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">({tour.reviews})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 flex items-start">
                    <HiLocationMarker className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0 text-gray-400" />
                    {tour.destinations}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-sm">
                      <HiClock className="w-4 h-4 mr-1" />
                      {tour.duration}
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">From </span>
                      <span className="text-xl font-bold text-orange-600">₹{tour.price}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/tours"
              className="inline-flex items-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              View All Tour Packages
              <HiArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Travel With Us?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              15+ years of expertise in organizing memorable pilgrimage and heritage tours
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center text-gray-300">
              <HiShieldCheck className="w-6 h-6 text-green-400 mr-2" />
              100% Safe Travel
            </div>
            <div className="flex items-center text-gray-300">
              <HiCheckCircle className="w-6 h-6 text-green-400 mr-2" />
              Verified Hotels
            </div>
            <div className="flex items-center text-gray-300">
              <HiUserGroup className="w-6 h-6 text-green-400 mr-2" />
              Expert Guides
            </div>
            <div className="flex items-center text-gray-300">
              <HiPhone className="w-6 h-6 text-green-400 mr-2" />
              24/7 Support
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-gray-600 text-lg">
              Real experiences from happy pilgrims and travelers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rajesh Sharma',
                location: 'Mumbai',
                tour: 'Char Dham Yatra',
                review: 'An incredible spiritual journey! The organization was perfect and the guides were very knowledgeable. Felt blessed throughout the trip.'
              },
              {
                name: 'Priya Patel',
                location: 'Ahmedabad',
                tour: 'Varanasi Tour',
                review: 'The Ganga Aarti experience was divine. Everything was well arranged - hotels, food, and transportation. Highly recommended!'
              },
              {
                name: 'Amit Kumar',
                location: 'Delhi',
                tour: 'Golden Triangle',
                review: 'Best heritage tour experience. Our guide\'s knowledge of history was amazing. Will definitely travel again with Sacred Journeys.'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.review}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg mr-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.tour} • {testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
            Book your pilgrimage or heritage tour today and create memories that last a lifetime
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/tours"
              className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              <HiLocationMarker className="mr-2 w-5 h-5" />
              Browse Tours
            </Link>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center px-8 py-4 bg-orange-700 text-white font-bold rounded-lg hover:bg-orange-800 transition-all"
            >
              <HiPhone className="mr-2 w-5 h-5" />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
