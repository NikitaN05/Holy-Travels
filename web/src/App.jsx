import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Tours = lazy(() => import('./pages/Tours'));
const TourDetails = lazy(() => import('./pages/TourDetails'));
const Gallery = lazy(() => import('./pages/Gallery'));
const AlbumDetails = lazy(() => import('./pages/AlbumDetails'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const MyTrip = lazy(() => import('./pages/MyTrip'));
const Booking = lazy(() => import('./pages/Booking'));
const Menu = lazy(() => import('./pages/Menu'));
const Emergency = lazy(() => import('./pages/Emergency'));
const Polls = lazy(() => import('./pages/Polls'));
const Hospitality = lazy(() => import('./pages/Hospitality'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminTours = lazy(() => import('./pages/admin/Tours'));
const AdminBookings = lazy(() => import('./pages/admin/Bookings'));
const AdminTravellers = lazy(() => import('./pages/admin/Travellers'));
const AdminGallery = lazy(() => import('./pages/admin/Gallery'));
const AdminMenu = lazy(() => import('./pages/admin/Menu'));
const AdminPolls = lazy(() => import('./pages/admin/Polls'));
const AdminNotifications = lazy(() => import('./pages/admin/Notifications'));
const AdminEmergency = lazy(() => import('./pages/admin/Emergency'));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="tours" element={<Tours />} />
            <Route path="tours/:slug" element={<TourDetails />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="gallery/:id" element={<AlbumDetails />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="hospitality" element={<Hospitality />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<Profile />} />
              <Route path="my-trip" element={<MyTrip />} />
              <Route path="booking/:tourId" element={<Booking />} />
              <Route path="menu" element={<Menu />} />
              <Route path="emergency" element={<Emergency />} />
              <Route path="polls" element={<Polls />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="admin" element={<AdminRoute />}>
              <Route index element={<AdminDashboard />} />
              <Route path="tours" element={<AdminTours />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="travellers" element={<AdminTravellers />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="polls" element={<AdminPolls />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="emergency" element={<AdminEmergency />} />
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default App;

