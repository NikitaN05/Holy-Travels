import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import {
  HiExclamation,
  HiPhone,
  HiLocationMarker,
  HiClock,
  HiCheck,
  HiX
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { emergencyAPI } from '../services/api';
import socketService from '../services/socket';

const Emergency = () => {
  const { t } = useTranslation();
  const [isTriggering, setIsTriggering] = useState(false);
  const [activeAlert, setActiveAlert] = useState(null);

  const { data: myAlerts, refetch } = useQuery('myEmergencyAlerts', () =>
    emergencyAPI.getMyAlerts().then(res => res.data.data)
  );

  useEffect(() => {
    // Listen for emergency updates
    const unsubscribe = socketService.subscribe('emergency_acknowledged', (data) => {
      if (activeAlert?._id === data.emergencyId) {
        toast.success('Help is on the way! Your alert has been acknowledged.');
        refetch();
      }
    });

    return () => unsubscribe();
  }, [activeAlert, refetch]);

  useEffect(() => {
    // Check for active alerts
    if (myAlerts?.length > 0) {
      const active = myAlerts.find(a => a.status === 'active' || a.status === 'acknowledged');
      setActiveAlert(active || null);
    }
  }, [myAlerts]);

  const triggerEmergency = async (type = 'sos') => {
    setIsTriggering(true);
    
    try {
      let location = {};
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              maximumAge: 0
            });
          });
          location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
        } catch (e) {
          console.warn('Could not get location:', e);
        }
      }

      const response = await emergencyAPI.trigger({ type, location });
      
      // Play siren sound
      const audio = new Audio('/sounds/emergency-siren.mp3');
      audio.volume = 1;
      audio.play().catch(() => {});

      toast.success(t('emergency.alertSent'), { duration: 5000, icon: '🚨' });
      refetch();
    } catch (error) {
      toast.error('Failed to send alert. Please call emergency services directly.');
    } finally {
      setIsTriggering(false);
    }
  };

  const cancelAlert = async () => {
    if (!activeAlert) return;
    
    try {
      await emergencyAPI.cancel(activeAlert._id);
      toast.success('Emergency alert cancelled');
      setActiveAlert(null);
      refetch();
    } catch (error) {
      toast.error('Failed to cancel alert');
    }
  };

  const emergencyContacts = [
    { name: 'Police', number: '100', icon: '🚔' },
    { name: 'Ambulance', number: '102', icon: '🚑' },
    { name: 'Fire', number: '101', icon: '🚒' },
    { name: 'Women Helpline', number: '1091', icon: '👩' },
    { name: 'Tourist Helpline', number: '1363', icon: '✈️' }
  ];

  const statusColors = {
    active: 'bg-red-500 text-white animate-pulse',
    acknowledged: 'bg-yellow-500 text-white',
    responding: 'bg-blue-500 text-white',
    resolved: 'bg-green-500 text-white',
    false_alarm: 'bg-gray-500 text-white'
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Active Alert Banner */}
        {activeAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-600 text-white rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4 animate-pulse">
                  <HiExclamation className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Active Emergency Alert</h2>
                  <p className="text-white/80">
                    Status: {activeAlert.status.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={cancelAlert}
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                {t('emergency.cancelAlert')}
              </button>
            </div>
          </motion.div>
        )}

        {/* Main Emergency Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('emergency.title')}</h1>
          <p className="text-gray-600 mb-8">
            Press the button below to alert our support team immediately
          </p>

          {/* SOS Button */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25"></div>
            <button
              onClick={() => triggerEmergency('sos')}
              disabled={isTriggering || activeAlert}
              className="relative w-40 h-40 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-2xl text-white font-bold text-xl hover:from-red-600 hover:to-red-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center"
            >
              {isTriggering ? (
                <span className="loader w-8 h-8 border-4"></span>
              ) : (
                <>
                  <HiExclamation className="w-12 h-12 mb-1" />
                  <span>SOS</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Emergency Types */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { type: 'medical', icon: '🏥', label: 'Medical' },
              { type: 'safety', icon: '🛡️', label: 'Safety' },
              { type: 'lost', icon: '📍', label: "I'm Lost" },
              { type: 'general', icon: '❓', label: 'Other' }
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => triggerEmergency(item.type)}
                disabled={isTriggering || activeAlert}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <span className="text-3xl mb-2 block">{item.icon}</span>
                <span className="text-gray-700 font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Emergency Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {emergencyContacts.map((contact) => (
              <a
                key={contact.number}
                href={`tel:${contact.number}`}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-saffron-50 transition-colors group"
              >
                <span className="text-3xl mb-2">{contact.icon}</span>
                <span className="text-sm text-gray-600">{contact.name}</span>
                <span className="font-bold text-saffron-600 group-hover:text-saffron-700">
                  {contact.number}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Past Alerts */}
        {myAlerts?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Alert History</h2>
            <div className="space-y-4">
              {myAlerts.slice(0, 5).map((alert) => (
                <div
                  key={alert._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${statusColors[alert.status]}`}>
                      {alert.status === 'resolved' ? (
                        <HiCheck className="w-6 h-6" />
                      ) : alert.status === 'false_alarm' ? (
                        <HiX className="w-6 h-6" />
                      ) : (
                        <HiExclamation className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">
                        {alert.type} Alert
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 space-x-3">
                        <span className="flex items-center">
                          <HiClock className="w-4 h-4 mr-1" />
                          {new Date(alert.createdAt).toLocaleString()}
                        </span>
                        {alert.location?.address && (
                          <span className="flex items-center">
                            <HiLocationMarker className="w-4 h-4 mr-1" />
                            {alert.location.address}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[alert.status]}`}>
                    {alert.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safety Tips */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <h3 className="font-bold text-yellow-800 mb-3">Safety Tips</h3>
          <ul className="space-y-2 text-yellow-700 text-sm">
            <li>• Always stay with your tour group during the trip</li>
            <li>• Keep your emergency contacts updated in your profile</li>
            <li>• Share your live location with family members</li>
            <li>• Keep our tour guide's contact number handy</li>
            <li>• In case of emergency, first ensure your safety before alerting</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Emergency;

