import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiHome,
  HiMap,
  HiTicket,
  HiUsers,
  HiPhotograph,
  HiClipboardList,
  HiChartPie,
  HiBell,
  HiExclamation,
  HiMenu,
  HiX,
  HiLogout,
  HiArrowLeft
} from 'react-icons/hi';
import useAuthStore from '../store/authStore';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const menuItems = [
    { to: '/admin', icon: HiHome, label: 'Dashboard', exact: true },
    { to: '/admin/tours', icon: HiMap, label: 'Tours' },
    { to: '/admin/bookings', icon: HiTicket, label: 'Bookings' },
    { to: '/admin/travellers', icon: HiUsers, label: 'Travellers' },
    { to: '/admin/gallery', icon: HiPhotograph, label: 'Gallery' },
    { to: '/admin/menu', icon: HiClipboardList, label: 'Menu' },
    { to: '/admin/polls', icon: HiChartPie, label: 'Polls' },
    { to: '/admin/notifications', icon: HiBell, label: 'Notifications' },
    { to: '/admin/emergency', icon: HiExclamation, label: 'Emergency' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-20 bottom-0 bg-gray-900 text-white transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && (
            <span className="text-lg font-semibold">Admin Panel</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {sidebarOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-saffron-500 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 space-y-2">
          <NavLink
            to="/"
            className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <HiArrowLeft className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Back to Site</span>}
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors"
          >
            <HiLogout className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

