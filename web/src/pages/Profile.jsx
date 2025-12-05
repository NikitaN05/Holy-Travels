import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  HiUser,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiIdentification,
  HiClock,
  HiStar,
  HiCreditCard,
  HiPencil,
  HiCheck
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { usersAPI, travellersAPI } from '../services/api';

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const { data: profileData, refetch } = useQuery('userProfile', () =>
    usersAPI.getProfile().then(res => res.data.data)
  );

  const { data: travelHistory } = useQuery('travelHistory', () =>
    usersAPI.getTravelHistory().then(res => res.data.data)
  );

  const { data: stats } = useQuery('travellerStats', () =>
    travellersAPI.getStats().then(res => res.data.data)
  );

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || {}
    }
  });

  const onSubmit = async (data) => {
    const result = await updateProfile(data);
    if (result.success) {
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      refetch();
    } else {
      toast.error(result.message || 'Failed to update profile');
    }
  };

  const tabs = [
    { id: 'personal', label: t('profile.personalInfo'), icon: HiUser },
    { id: 'travel', label: t('profile.travelHistory'), icon: HiClock },
    { id: 'emergency', label: t('profile.emergencyContacts'), icon: HiPhone },
    { id: 'preferences', label: t('profile.preferences'), icon: HiStar }
  ];

  const tierColors = {
    bronze: 'bg-orange-100 text-orange-700',
    silver: 'bg-gray-100 text-gray-700',
    gold: 'bg-yellow-100 text-yellow-700',
    platinum: 'bg-purple-100 text-purple-700'
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-saffron-500 to-primary-600 rounded-3xl p-8 text-white mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                user?.name?.charAt(0) || '👤'
              )}
            </div>
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-3xl font-bold mb-1">{user?.name}</h1>
              <p className="text-white/80 mb-4">{user?.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${tierColors[stats?.stats?.membershipTier || 'bronze']}`}>
                  {stats?.stats?.membershipTier?.toUpperCase() || 'BRONZE'} Member
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
                  {stats?.stats?.loyaltyPoints || 0} Points
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">{stats?.stats?.totalTrips || 0}</div>
                <div className="text-white/80 text-sm">{t('profile.totalTrips')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats?.stats?.destinationsVisited || 0}</div>
                <div className="text-white/80 text-sm">Destinations</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats?.stats?.averageRating?.toFixed(1) || '0.0'}</div>
                <div className="text-white/80 text-sm">Avg Rating</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-saffron-600 border-b-2 border-saffron-500 bg-saffron-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center text-saffron-600 hover:text-saffron-700"
                  >
                    {isEditing ? <HiCheck className="w-5 h-5 mr-1" /> : <HiPencil className="w-5 h-5 mr-1" />}
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          {...register('name', { required: 'Name is required' })}
                          className="input-field"
                        />
                      ) : (
                        <p className="py-3 text-gray-900">{user?.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <p className="py-3 text-gray-900">{user?.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          {...register('phone')}
                          className="input-field"
                        />
                      ) : (
                        <p className="py-3 text-gray-900">{user?.phone || '-'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aadhar Number (Masked)
                      </label>
                      <p className="py-3 text-gray-900">
                        {profileData?.maskedAadhar || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          {...register('address.street')}
                          placeholder="Street"
                          className="input-field"
                        />
                        <input
                          {...register('address.city')}
                          placeholder="City"
                          className="input-field"
                        />
                        <input
                          {...register('address.state')}
                          placeholder="State"
                          className="input-field"
                        />
                        <input
                          {...register('address.pincode')}
                          placeholder="Pincode"
                          className="input-field"
                        />
                      </div>
                    ) : (
                      <p className="py-3 text-gray-900">
                        {user?.address?.street ? 
                          `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.pincode}` 
                          : 'Not provided'}
                      </p>
                    )}
                  </div>

                  {isEditing && (
                    <button type="submit" className="btn-primary">
                      Save Changes
                    </button>
                  )}
                </form>
              </motion.div>
            )}

            {/* Travel History Tab */}
            {activeTab === 'travel' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Travel History</h2>
                
                {travelHistory?.history?.length > 0 ? (
                  <div className="space-y-4">
                    {travelHistory.history.map((trip, index) => (
                      <div
                        key={index}
                        className="flex items-center p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="w-16 h-16 bg-saffron-100 rounded-lg flex items-center justify-center text-2xl mr-4">
                          🛕
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-gray-900">
                            {trip.tour?.title?.en || 'Unknown Tour'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {trip.destinations?.join(', ')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(trip.startDate).toLocaleDateString('en-IN')} - 
                            {new Date(trip.endDate).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        {trip.rating && (
                          <div className="flex items-center">
                            <HiStar className="w-5 h-5 text-yellow-400 mr-1" />
                            <span className="font-medium">{trip.rating}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <HiClock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>No travel history yet. Book your first tour!</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Emergency Contacts Tab */}
            {activeTab === 'emergency' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Emergency Contacts</h2>
                
                {profileData?.traveller?.emergencyContacts?.length > 0 ? (
                  <div className="space-y-4">
                    {profileData.traveller.emergencyContacts.map((contact, index) => (
                      <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-4">
                          <HiPhone className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                          <p className="text-sm text-gray-500">{contact.relation}</p>
                          <p className="text-sm text-gray-600">{contact.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>No emergency contacts added yet.</p>
                    <button className="btn-primary mt-4">Add Contact</button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dietary Preference
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['veg', 'non-veg', 'vegan', 'jain'].map((pref) => (
                        <button
                          key={pref}
                          className={`px-4 py-2 rounded-full capitalize ${
                            profileData?.traveller?.dietaryPreferences === pref
                              ? 'bg-saffron-500 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {pref}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Language
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { code: 'en', label: 'English' },
                        { code: 'hi', label: 'हिंदी' },
                        { code: 'mr', label: 'मराठी' }
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          className={`px-4 py-2 rounded-full ${
                            user?.preferredLanguage === lang.code
                              ? 'bg-saffron-500 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Information
                    </label>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-600">
                        <strong>Blood Group:</strong> {profileData?.traveller?.bloodGroup || 'Not specified'}
                      </p>
                      <p className="text-gray-600 mt-2">
                        <strong>Medical Conditions:</strong>{' '}
                        {profileData?.traveller?.medicalConditions?.join(', ') || 'None specified'}
                      </p>
                      <p className="text-gray-600 mt-2">
                        <strong>Allergies:</strong>{' '}
                        {profileData?.traveller?.allergies?.join(', ') || 'None specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

