import React from 'react';
import { useQuery } from 'react-query';
import { HiPlus, HiPencil, HiCalendar } from 'react-icons/hi';
import { menuAPI } from '../../services/api';

const AdminMenu = () => {
  const { data: weekMenu } = useQuery('adminWeekMenu', () =>
    menuAPI.getWeek().then(res => res.data.data)
  );

  const mealTypes = [
    { key: 'breakfast', icon: '🍳', label: 'Breakfast' },
    { key: 'lunch', icon: '🍱', label: 'Lunch' },
    { key: 'dinner', icon: '🍽️', label: 'Dinner' }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600">Manage daily food menus</p>
        </div>
        <button className="btn-primary flex items-center">
          <HiPlus className="w-5 h-5 mr-2" />
          Add Menu
        </button>
      </div>

      {/* This Week's Menu */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <HiCalendar className="w-6 h-6 mr-2 text-saffron-500" />
          This Week's Menu
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {weekMenu?.map((menu) => (
            <div key={menu._id} className="bg-gray-50 rounded-xl p-4 relative group">
              <button className="absolute top-2 right-2 p-1 bg-white rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                <HiPencil className="w-4 h-4 text-gray-500" />
              </button>
              
              <p className="font-semibold text-gray-900 mb-3">
                {new Date(menu.date).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
              </p>
              
              <div className="space-y-2">
                {mealTypes.map((meal) => (
                  <div key={meal.key} className="flex items-start">
                    <span className="mr-2">{meal.icon}</span>
                    <div className="text-sm">
                      <span className="text-gray-500">{meal.label}:</span>
                      <span className="text-gray-700 ml-1">
                        {menu[meal.key]?.items?.[0]?.name?.en || 'Not set'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Add Day Card */}
          <button className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-4 flex flex-col items-center justify-center text-gray-500 hover:border-saffron-500 hover:text-saffron-500 min-h-[160px]">
            <HiPlus className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">Add Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;

