import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import {
  HiUsers,
  HiTicket,
  HiMap,
  HiCurrencyRupee,
  HiExclamation,
  HiStar,
  HiTrendingUp,
  HiArrowRight
} from 'react-icons/hi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { adminAPI } from '../../services/api';

const Dashboard = () => {
  const { data, isLoading } = useQuery('adminDashboard', () =>
    adminAPI.getDashboard().then(res => res.data.data)
  );

  const statCards = [
    { 
      label: 'Total Users', 
      value: data?.overview?.totalUsers || 0, 
      icon: HiUsers, 
      color: 'bg-blue-500',
      change: '+12%' 
    },
    { 
      label: 'Total Bookings', 
      value: data?.overview?.totalBookings || 0, 
      icon: HiTicket, 
      color: 'bg-green-500',
      change: '+8%' 
    },
    { 
      label: 'Active Tours', 
      value: data?.overview?.totalTours || 0, 
      icon: HiMap, 
      color: 'bg-purple-500',
      change: '+3' 
    },
    { 
      label: 'Total Revenue', 
      value: `₹${(data?.overview?.totalRevenue || 0).toLocaleString()}`, 
      icon: HiCurrencyRupee, 
      color: 'bg-saffron-500',
      change: '+15%' 
    }
  ];

  const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to Holy Travels Admin Panel</p>
      </div>

      {/* Alert Banner */}
      {data?.overview?.activeEmergencies > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-600 text-white rounded-xl p-4 mb-6 flex items-center justify-between"
        >
          <div className="flex items-center">
            <HiExclamation className="w-6 h-6 mr-3 animate-pulse" />
            <span className="font-medium">
              {data.overview.activeEmergencies} Active Emergency Alert(s)
            </span>
          </div>
          <Link to="/admin/emergency" className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50">
            View Alerts
          </Link>
        </motion.div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-500 text-sm font-medium flex items-center">
                <HiTrendingUp className="w-4 h-4 mr-1" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Booking Trends Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.bookingTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="_id.month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#ff7f11" strokeWidth={3} dot={{ fill: '#ff7f11' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings by Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Bookings by Status</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.bookingsByStatus || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                  label={({ _id, count }) => `${_id}: ${count}`}
                >
                  {(data?.bookingsByStatus || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Bookings</h3>
            <Link to="/admin/bookings" className="text-saffron-600 text-sm font-medium flex items-center hover:text-saffron-700">
              View All <HiArrowRight className="ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {(data?.recentBookings || []).slice(0, 5).map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{booking.user?.name}</p>
                  <p className="text-sm text-gray-500">{booking.tour?.title}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-saffron-600">₹{booking.totalAmount?.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tours */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Top Tours</h3>
            <Link to="/admin/tours" className="text-saffron-600 text-sm font-medium flex items-center hover:text-saffron-700">
              View All <HiArrowRight className="ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {(data?.topTours || []).map((tour, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600' :
                    index === 1 ? 'bg-gray-200 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                  <p className="font-medium text-gray-900">{tour.title}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{tour.bookings} bookings</p>
                  <p className="text-sm text-gray-500">₹{tour.revenue?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Add New Tour', to: '/admin/tours', icon: HiMap, color: 'bg-purple-500' },
          { label: 'View Bookings', to: '/admin/bookings', icon: HiTicket, color: 'bg-green-500' },
          { label: 'Send Notification', to: '/admin/notifications', icon: HiStar, color: 'bg-blue-500' },
          { label: 'Upload Gallery', to: '/admin/gallery', icon: HiUsers, color: 'bg-pink-500' }
        ].map((action, index) => (
          <Link
            key={index}
            to={action.to}
            className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow flex items-center"
          >
            <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mr-3`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-gray-900">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

