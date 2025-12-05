import React, { useState, useEffect, Fragment } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import {
  HiMenu,
  HiX,
  HiUser,
  HiLogout,
  HiTicket,
  HiCog,
  HiBell,
  HiGlobe
} from 'react-icons/hi';
import useAuthStore from '../store/authStore';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' }
];

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  const navLinks = [
    { to: '/', label: t('common.home') },
    { to: '/tours', label: t('common.tours') },
    { to: '/gallery', label: t('common.gallery') },
    { to: '/hospitality', label: t('nav.hospitality') },
    { to: '/about', label: t('common.about') },
    { to: '/contact', label: t('common.contact') }
  ];

  const userMenuItems = [
    { to: '/profile', label: t('common.profile'), icon: HiUser },
    { to: '/my-trip', label: t('nav.myTrip'), icon: HiTicket },
    { to: '/menu', label: t('nav.menu'), icon: HiCog }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-saffron-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">🙏</span>
            </div>
            <div>
              <span className={`text-xl font-display font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                Holy Travels
              </span>
              <p className={`text-xs ${isScrolled ? 'text-gray-500' : 'text-white/80'}`}>
                Sacred Journeys
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `nav-link ${isScrolled ? 'text-gray-700' : 'text-white'} ${
                    isActive ? 'font-semibold' : ''
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right side - Language & Auth */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Selector */}
            <Menu as="div" className="relative">
              <Menu.Button
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                <HiGlobe className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {languages.find(l => l.code === i18n.language)?.flag || '🌐'}
                </span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {languages.map((lang) => (
                    <Menu.Item key={lang.code}>
                      {({ active }) => (
                        <button
                          onClick={() => changeLanguage(lang.code)}
                          className={`${
                            active ? 'bg-saffron-50' : ''
                          } ${
                            i18n.language === lang.code ? 'text-saffron-600 font-medium' : 'text-gray-700'
                          } w-full text-left px-4 py-2 text-sm flex items-center space-x-2`}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>

            {isAuthenticated ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-saffron-500 text-white hover:bg-saffron-600 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <HiUser className="w-5 h-5" />
                    )}
                  </div>
                  <span className="font-medium">{user?.name?.split(' ')[0]}</span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userMenuItems.map((item) => (
                      <Menu.Item key={item.to}>
                        {({ active }) => (
                          <Link
                            to={item.to}
                            className={`${
                              active ? 'bg-saffron-50' : ''
                            } flex items-center px-4 py-2 text-sm text-gray-700`}
                          >
                            <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                            {item.label}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                    {user?.role === 'admin' || user?.role === 'super_admin' ? (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/admin"
                            className={`${
                              active ? 'bg-saffron-50' : ''
                            } flex items-center px-4 py-2 text-sm text-gray-700 border-t`}
                          >
                            <HiCog className="w-5 h-5 mr-3 text-gray-400" />
                            Admin Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                    ) : null}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-red-50' : ''
                          } flex items-center w-full px-4 py-2 text-sm text-red-600 border-t`}
                        >
                          <HiLogout className="w-5 h-5 mr-3" />
                          {t('common.logout')}
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-4 py-2 font-medium transition-colors ${
                    isScrolled ? 'text-gray-700 hover:text-saffron-600' : 'text-white hover:text-saffron-200'
                  }`}
                >
                  {t('common.login')}
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  {t('common.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-saffron-50 text-saffron-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex space-x-2 mb-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        i18n.language === lang.code
                          ? 'bg-saffron-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {lang.flag} {lang.name}
                    </button>
                  ))}
                </div>
                
                {isAuthenticated ? (
                  <>
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg mt-2"
                    >
                      <HiLogout className="w-5 h-5 mr-3" />
                      {t('common.logout')}
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center py-3 text-gray-700 font-medium rounded-lg border border-gray-300"
                    >
                      {t('common.login')}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center btn-primary"
                    >
                      {t('common.register')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

