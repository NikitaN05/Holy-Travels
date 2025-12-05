import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const Hospitality = () => {
  const services = [
    {
      title: 'Authentic Regional Cuisine',
      description: 'Experience the rich flavors of Indian cuisine with our carefully prepared meals. Pure vegetarian food made with fresh ingredients and traditional recipes.',
      icon: '🍽️',
      features: ['Pure Vegetarian', 'Hygienic Preparation', 'Regional Specialties', 'Dietary Options Available']
    },
    {
      title: 'Comfortable Accommodation',
      description: 'Rest peacefully in clean and comfortable hotels. We ensure quality stays at every destination with all modern amenities.',
      icon: '🏨',
      features: ['Clean Rooms', 'Hot Water', 'AC/Heater', 'Quality Bedding']
    },
    {
      title: 'Safe Transportation',
      description: 'Travel worry-free in our well-maintained, comfortable vehicles with experienced drivers who know the routes well.',
      icon: '🚌',
      features: ['AC Vehicles', 'Experienced Drivers', 'Regular Maintenance', 'Emergency Support']
    },
    {
      title: 'Expert Guides',
      description: 'Learn the history, mythology, and significance of every place from our knowledgeable guides who make your journey informative.',
      icon: '👨‍🏫',
      features: ['Multilingual Guides', 'In-depth Knowledge', 'Cultural Insights', 'Personal Attention']
    },
    {
      title: 'Medical Support',
      description: 'Your health is our priority. We have first-aid facilities and medical support arrangements throughout the tour.',
      icon: '🏥',
      features: ['First Aid Kit', 'Doctor on Call', 'Emergency Contacts', 'Medical Assistance']
    },
    {
      title: '24/7 Support',
      description: 'Our team is available round the clock to assist you with any needs or emergencies during your journey.',
      icon: '📞',
      features: ['Helpline Number', 'WhatsApp Support', 'Emergency Siren', 'Tour Manager']
    }
  ];

  const foodImages = [
    { url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600', caption: 'Traditional Thali' },
    { url: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600', caption: 'Fresh Breakfast' },
    { url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600', caption: 'Evening Snacks' },
    { url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600', caption: 'Special Sweets' }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      tour: 'Char Dham Yatra',
      review: 'The food was absolutely amazing! Every meal felt like home. The hotels were clean and staff was very caring.',
      rating: 5
    },
    {
      name: 'Sunita Patil',
      tour: 'Shirdi Tour',
      review: 'Best hospitality I have experienced. The guides were knowledgeable and the arrangements were perfect.',
      rating: 5
    },
    {
      name: 'Mohan Desai',
      tour: 'Varanasi Package',
      review: 'Everything was well organized. Food, accommodation, transport - all top notch. Will definitely travel again.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-green-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-6xl mb-4 block">🙏</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Our Hospitality
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              At Holy Travels, we treat every traveller as our family. Experience warmth, 
              care, and comfort throughout your spiritual journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive services to make your pilgrimage comfortable and memorable
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Delicious Food
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Taste the authentic flavors prepared with love and traditional recipes
            </p>
          </motion.div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 }
            }}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {foodImages.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-64 rounded-2xl overflow-hidden group">
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <p className="absolute bottom-4 left-4 text-white font-medium">{img.caption}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              What Travellers Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonial.review}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.tour}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-20 bg-gradient-to-r from-saffron-500 to-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-display font-bold mb-6">
              Our Commitment to You
            </h2>
            <p className="text-white/90 text-lg mb-8 leading-relaxed">
              We understand that a pilgrimage is not just a trip—it's a sacred journey. 
              That's why we go above and beyond to ensure your comfort, safety, and 
              spiritual fulfillment at every step.
            </p>
            <Link to="/tours" className="btn-secondary">
              Explore Our Tours
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Hospitality;

