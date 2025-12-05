import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiExclamation, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { emergencyAPI } from '../services/api';
import socketService from '../services/socket';

const EmergencyButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);

  const handleEmergencyClick = () => {
    setShowConfirm(true);
  };

  const triggerEmergency = async () => {
    setIsTriggering(true);
    
    try {
      // Get user's location
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

      // Trigger emergency via API
      await emergencyAPI.trigger({
        type: 'sos',
        location
      });

      // Also emit via socket for real-time
      socketService.triggerEmergency({
        location,
        timestamp: new Date()
      });

      // Play alert sound
      const audio = new Audio('/sounds/emergency-siren.mp3');
      audio.volume = 1;
      audio.play().catch(() => {});

      toast.success(t('emergency.alertSent'), {
        duration: 5000,
        icon: '🚨'
      });

      setShowConfirm(false);
      navigate('/emergency');
    } catch (error) {
      toast.error('Failed to send emergency alert. Please call emergency services directly.');
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <>
      {/* Fixed Emergency Button */}
      <motion.button
        onClick={handleEmergencyClick}
        className="fixed bottom-6 right-6 w-16 h-16 bg-red-600 rounded-full shadow-lg flex items-center justify-center emergency-pulse z-50 hover:bg-red-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Emergency"
      >
        <HiExclamation className="w-8 h-8 text-white" />
      </motion.button>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !isTriggering && setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <HiExclamation className="w-10 h-10 text-red-600" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t('emergency.confirmTitle')}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {t('emergency.confirmMessage')}
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isTriggering}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={triggerEmergency}
                    disabled={isTriggering}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isTriggering ? (
                      <span className="loader w-5 h-5 border-2"></span>
                    ) : (
                      <>
                        <HiExclamation className="w-5 h-5 mr-2" />
                        {t('emergency.triggerAlert')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmergencyButton;

