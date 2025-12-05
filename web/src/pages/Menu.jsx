import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { HiClock, HiCalendar } from 'react-icons/hi';
import { menuAPI } from '../services/api';

const Menu = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { data: todayMenu, isLoading } = useQuery('todayMenu', () =>
    menuAPI.getToday().then(res => res.data.data)
  );

  const { data: weekMenu } = useQuery('weekMenu', () =>
    menuAPI.getWeek().then(res => res.data.data)
  );

  const mealTypes = [
    { key: 'breakfast', icon: '🍳', label: t('menu.breakfast'), time: '7:00 AM - 9:00 AM' },
    { key: 'lunch', icon: '🍱', label: t('menu.lunch'), time: '12:30 PM - 2:30 PM' },
    { key: 'snacks', icon: '☕', label: t('menu.snacks'), time: '4:30 PM - 5:30 PM' },
    { key: 'dinner', icon: '🍽️', label: t('menu.dinner'), time: '7:30 PM - 9:30 PM' }
  ];

  const dietLabels = {
    veg: { color: 'bg-green-500', label: 'Veg' },
    'non-veg': { color: 'bg-red-500', label: 'Non-Veg' },
    vegan: { color: 'bg-green-600', label: 'Vegan' },
    jain: { color: 'bg-yellow-500', label: 'Jain' }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-6xl mb-4 block">🍽️</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {t('menu.title')}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Delicious vegetarian meals prepared with love and traditional recipes
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Today's Menu */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <HiCalendar className="w-6 h-6 mr-2 text-green-600" />
              Today's Menu
            </h2>
            <span className="text-gray-500">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : todayMenu ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mealTypes.map((meal, index) => (
                <motion.div
                  key={meal.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                    {meal.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{meal.label}</h3>
                  <p className="text-sm text-gray-500 flex items-center mb-4">
                    <HiClock className="w-4 h-4 mr-1" />
                    {todayMenu[meal.key]?.timing?.start || meal.time}
                  </p>
                  
                  {todayMenu[meal.key]?.items?.length > 0 ? (
                    <ul className="space-y-2">
                      {todayMenu[meal.key].items.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className={`w-2 h-2 mt-2 mr-2 rounded-full ${dietLabels[item.type]?.color || 'bg-green-500'}`}></span>
                          <div>
                            <span className="text-gray-700">
                              {item.name?.[lang] || item.name?.en || item.name}
                            </span>
                            {item.description && (
                              <p className="text-xs text-gray-500">
                                {item.description?.[lang] || item.description?.en}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm italic">Menu not available</p>
                  )}
                  
                  {todayMenu[meal.key]?.specialNotes && (
                    <p className="mt-4 text-sm text-green-600 bg-green-50 p-2 rounded">
                      {todayMenu[meal.key].specialNotes?.[lang] || todayMenu[meal.key].specialNotes?.en}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <span className="text-6xl mb-4 block">🍽️</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('menu.noMenu')}</h3>
              <p className="text-gray-500">Please check back later or contact our team.</p>
            </div>
          )}
        </section>

        {/* Week's Menu */}
        {weekMenu?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">This Week's Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weekMenu.map((menu, index) => (
                <motion.div
                  key={menu._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900">
                      {new Date(menu.date).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                    {new Date(menu.date).toDateString() === new Date().toDateString() && (
                      <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">Today</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {mealTypes.slice(0, 4).map((meal) => (
                      <div key={meal.key} className="flex items-center">
                        <span className="mr-1">{meal.icon}</span>
                        <span className="text-gray-600 truncate">
                          {menu[meal.key]?.items?.[0]?.name?.en || '-'}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Dietary Info */}
        <section className="mt-12 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Dietary Information</h2>
          <div className="flex flex-wrap gap-4">
            {Object.entries(dietLabels).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <span className={`w-3 h-3 rounded-full ${value.color} mr-2`}></span>
                <span className="text-gray-700">{value.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-gray-600 text-sm">
            All our meals are prepared with fresh, hygienic ingredients. 
            Special dietary requirements can be accommodated with prior notice.
            Please inform our team about any allergies or specific dietary needs.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Menu;

