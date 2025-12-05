import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { HiPlus, HiPencil, HiTrash, HiEye, HiSearch } from 'react-icons/hi';
import { toursAPI } from '../../services/api';

const AdminTours = () => {
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useQuery(['adminTours', search], () =>
    toursAPI.getAll({ search, limit: 50 }).then(res => res.data.data)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tours Management</h1>
          <p className="text-gray-600">Manage all tours and packages</p>
        </div>
        <button className="btn-primary flex items-center">
          <HiPlus className="w-5 h-5 mr-2" />
          Add New Tour
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tours..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option value="">All Categories</option>
            <option value="pilgrimage">Pilgrimage</option>
            <option value="historic">Historic</option>
            <option value="cultural">Cultural</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan="6" className="px-6 py-10 text-center">Loading...</td></tr>
            ) : data?.tours?.length > 0 ? (
              data.tours.map((tour) => (
                <tr key={tour._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img 
                        src={tour.images?.[0]?.url || '/placeholder.jpg'} 
                        alt="" 
                        className="w-12 h-12 rounded-lg object-cover mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{tour.title?.en}</p>
                        <p className="text-sm text-gray-500">{tour.destinations?.length || 0} destinations</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-saffron-100 text-saffron-700 capitalize">
                      {tour.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{tour.duration?.days}D/{tour.duration?.nights}N</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">₹{tour.price?.amount?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tour.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {tour.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600"><HiEye className="w-5 h-5" /></button>
                      <button className="p-2 text-gray-400 hover:text-saffron-600"><HiPencil className="w-5 h-5" /></button>
                      <button className="p-2 text-gray-400 hover:text-red-600"><HiTrash className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">No tours found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTours;

