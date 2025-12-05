import React from 'react';
import { useQuery } from 'react-query';
import { HiSearch, HiEye, HiUserGroup } from 'react-icons/hi';
import api from '../../services/api';

const AdminTravellers = () => {
  const { data, isLoading } = useQuery('adminTravellers', () =>
    api.get('/travellers').then(res => res.data.data)
  );

  const tierColors = {
    bronze: 'bg-orange-100 text-orange-700',
    silver: 'bg-gray-100 text-gray-700',
    gold: 'bg-yellow-100 text-yellow-700',
    platinum: 'bg-purple-100 text-purple-700'
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Travellers</h1>
          <p className="text-gray-600">View and manage traveller profiles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {['bronze', 'silver', 'gold', 'platinum'].map((tier) => (
          <div key={tier} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 capitalize">{tier}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.travellers?.filter(t => t.membershipTier === tier).length || 0}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full ${tierColors[tier]} flex items-center justify-center`}>
                <HiUserGroup className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search travellers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option value="">All Tiers</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Traveller</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Trips</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Tour</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan="6" className="px-6 py-10 text-center">Loading...</td></tr>
            ) : data?.travellers?.length > 0 ? (
              data.travellers.map((traveller) => (
                <tr key={traveller._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-600 font-bold mr-3">
                        {traveller.userInfo?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{traveller.userInfo?.name}</p>
                        <p className="text-sm text-gray-500">{traveller.userInfo?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{traveller.totalTrips}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${tierColors[traveller.membershipTier]}`}>
                      {traveller.membershipTier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{traveller.loyaltyPoints}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {traveller.currentTour?.title || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-blue-600">
                      <HiEye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">No travellers found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTravellers;

