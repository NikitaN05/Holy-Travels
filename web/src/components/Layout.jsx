import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import EmergencyButton from './EmergencyButton';
import useAuthStore from '../store/authStore';
import socketService from '../services/socket';

const Layout = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Connect socket when user is authenticated
    if (isAuthenticated) {
      socketService.connect();
      if (user?.id) {
        socketService.joinUser(user.id);
      }
    }

    return () => {
      // Don't disconnect on unmount as we want persistent connection
    };
  }, [isAuthenticated, user]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <motion.main
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.3 }}
        className="flex-grow"
      >
        <Outlet />
      </motion.main>
      
      {!isAdminRoute && <Footer />}
      
      {/* Emergency button for authenticated users */}
      {isAuthenticated && !isAdminRoute && <EmergencyButton />}
    </div>
  );
};

export default Layout;

