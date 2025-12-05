import React from 'react';
import { useQuery } from 'react-query';
import { HiSearch, HiDownload, HiEye } from 'react-icons/hi';
import { bookingsAPI } from '../../services/api';

const AdminBookings = () => {
  const { data, isLoading } = useQuery('adminBookings', () =>
    bookingsAPI.getAll({ limit: 50 }).then(res => res.data.data)
  );

  const statusColors = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700'
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600">Manage all customer bookings</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <HiDownload className="w-5 h-5 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by booking ID, customer name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tour</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan="7" className="px-6 py-10 text-center">Loading...</td></tr>
            ) : data?.bookings?.length > 0 ? (
              data.bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-saffron-600">{booking.bookingId}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{booking.user?.name}</p>
                    <p className="text-sm text-gray-500">{booking.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{booking.tour?.title}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(booking.tourDate).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">₹{booking.totalAmount?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-blue-600">
                      <HiEye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-500">No bookings found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;

