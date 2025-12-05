import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa';

const Footer = () => {
  const { t } = useTranslation();

  const quickLinks = [
    { to: '/tours', label: t('common.tours') },
    { to: '/gallery', label: t('common.gallery') },
    { to: '/hospitality', label: t('nav.hospitality') },
    { to: '/about', label: t('common.about') },
    { to: '/contact', label: t('common.contact') }
  ];

  const tourCategories = [
    { to: '/tours?category=pilgrimage', label: t('nav.pilgrimage') },
    { to: '/tours?category=historic', label: t('nav.historic') },
    { to: '/tours?category=cultural', label: t('nav.cultural') }
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaYoutube, href: '#', label: 'YouTube' },
    { icon: FaWhatsapp, href: '#', label: 'WhatsApp' }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-saffron-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🙏</span>
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white">Holy Travels</h3>
                <p className="text-sm text-gray-400">Sacred Journeys</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-saffron-500 flex items-center justify-center transition-colors duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-saffron-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-saffron-500 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tour Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">{t('common.tours')}</h4>
            <ul className="space-y-3">
              {tourCategories.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-saffron-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-saffron-500 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">{t('footer.contactUs')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="w-5 h-5 text-saffron-500 mt-1 flex-shrink-0" />
                <span>123 Temple Road, Spiritual Plaza<br />Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="w-5 h-5 text-saffron-500 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-saffron-400 transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="w-5 h-5 text-saffron-500 flex-shrink-0" />
                <a href="mailto:info@holytravels.com" className="hover:text-saffron-400 transition-colors">
                  info@holytravels.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="font-medium text-white mb-3">{t('footer.newsletter')}</h5>
              <form className="flex">
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-saffron-500 text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-saffron-500 text-white rounded-r-lg hover:bg-saffron-600 transition-colors text-sm font-medium"
                >
                  {t('footer.subscribe')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-saffron-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-saffron-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-saffron-400 transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

