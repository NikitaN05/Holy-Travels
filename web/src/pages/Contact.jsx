import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiPhone, HiMail, HiLocationMarker, HiClock } from 'react-icons/hi';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    toast.success('Message sent successfully! We will get back to you soon.');
    reset();
  };

  const contactInfo = [
    { icon: HiPhone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
    { icon: FaWhatsapp, label: 'WhatsApp', value: '+91 98765 43210', href: 'https://wa.me/919876543210' },
    { icon: HiMail, label: 'Email', value: 'info@holytravels.com', href: 'mailto:info@holytravels.com' },
    { icon: HiLocationMarker, label: 'Address', value: '123 Temple Road, Spiritual Plaza, Mumbai 400001' }
  ];

  const officeHours = [
    { day: 'Monday - Friday', time: '9:00 AM - 7:00 PM' },
    { day: 'Saturday', time: '9:00 AM - 5:00 PM' },
    { day: 'Sunday', time: '10:00 AM - 2:00 PM' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero */}
      <section className="relative py-16 bg-gradient-to-r from-maroon-600 to-maroon-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Have questions? We're here to help. Reach out to us anytime!
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="input-field"
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    {...register('phone', { required: 'Phone is required' })}
                    className="input-field"
                    placeholder="Your phone"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                  })}
                  className="input-field"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select {...register('subject')} className="input-field">
                  <option value="general">General Inquiry</option>
                  <option value="booking">Booking Query</option>
                  <option value="feedback">Feedback</option>
                  <option value="complaint">Complaint</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  {...register('message', { required: 'Message is required' })}
                  rows="5"
                  className="input-field"
                  placeholder="How can we help you?"
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>

              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="grid gap-4">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.href}
                  className="flex items-start p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow group"
                >
                  <div className="w-12 h-12 bg-saffron-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-saffron-500 transition-colors">
                    <info.icon className="w-6 h-6 text-saffron-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{info.label}</p>
                    <p className="font-medium text-gray-900">{info.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Office Hours */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <HiClock className="w-5 h-5 mr-2 text-saffron-500" />
                Office Hours
              </h3>
              <div className="space-y-2">
                {officeHours.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{item.day}</span>
                    <span className="font-medium text-gray-900">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {[
                  { icon: FaFacebookF, href: '#', color: 'hover:bg-blue-600' },
                  { icon: FaInstagram, href: '#', color: 'hover:bg-pink-600' },
                  { icon: FaYoutube, href: '#', color: 'hover:bg-red-600' },
                  { icon: FaWhatsapp, href: '#', color: 'hover:bg-green-600' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center ${social.color} hover:text-white transition-all`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.7552396395387!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzMzLjYiTiA3MsKwNTInMzkuNyJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Office Location"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

