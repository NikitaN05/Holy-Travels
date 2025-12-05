import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHeart, HiShieldCheck, HiUserGroup, HiStar } from 'react-icons/hi';

const About = () => {
  const values = [
    {
      icon: HiHeart,
      title: 'Devotion',
      description: 'Every journey is a sacred experience, organized with deep reverence and spiritual understanding.'
    },
    {
      icon: HiShieldCheck,
      title: 'Trust & Safety',
      description: 'Your safety is our priority. We maintain highest standards in transportation, accommodation, and hygiene.'
    },
    {
      icon: HiUserGroup,
      title: 'Community',
      description: 'Travel with like-minded devotees and create lasting bonds on spiritual journeys.'
    },
    {
      icon: HiStar,
      title: 'Excellence',
      description: '15+ years of experience organizing memorable pilgrimages and cultural tours.'
    }
  ];

  const stats = [
    { value: '15+', label: 'Years of Service' },
    { value: '50,000+', label: 'Happy Travellers' },
    { value: '200+', label: 'Sacred Destinations' },
    { value: '500+', label: 'Tours Completed' }
  ];

  const team = [
    { name: 'Ramesh Sharma', role: 'Founder & CEO', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Priya Desai', role: 'Operations Head', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Amit Patel', role: 'Tour Manager', image: 'https://randomuser.me/api/portraits/men/46.jpg' },
    { name: 'Sunita Joshi', role: 'Customer Relations', image: 'https://randomuser.me/api/portraits/women/68.jpg' }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-saffron-500 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Our Story
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Holy Travels was founded with a simple mission: to make sacred pilgrimages accessible, 
              comfortable, and spiritually enriching for every devotee.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1545126758-d68b8e9f6af7?w=800"
                alt="Temple"
                className="rounded-2xl shadow-xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Founded in 2009, Holy Travels has been dedicated to organizing spiritual pilgrimages 
                and cultural tours that transform lives. We believe that every journey to a sacred 
                place should be a profound experience, not just a trip.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our team of experienced guides, comfortable transportation, and carefully selected 
                accommodations ensure that pilgrims can focus on their spiritual journey without 
                worrying about logistics.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From the snow-capped peaks of Char Dham to the ancient temples of South India, 
                from historic forts of Rajasthan to the cultural richness of Maharashtra, we 
                cover it all with devotion and dedication.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
              >
                <div className="w-16 h-16 bg-saffron-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-saffron-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-saffron-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dedicated professionals ensuring your journey is memorable
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
                />
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-saffron-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">
            Ready to Start Your Spiritual Journey?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of devotees who have experienced divine blessings with Holy Travels
          </p>
          <Link to="/tours" className="btn-primary">
            Explore Our Tours
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;

