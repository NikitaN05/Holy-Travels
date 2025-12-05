import React from 'react';
import { useQuery } from 'react-query';
import { HiPlus, HiBell, HiTrash } from 'react-icons/hi';
import api from '../../services/api';

const AdminNotifications = () => {
  const { data } = useQuery('adminNotifications', () =>
    api.get('/notifications/admin/all').then(res => res.data.data)
  );

  const typeIcons = {
    tour: '🗺️',
    menu: '🍽️',
    poll: '🗳️',
    emergency: '🚨',
    general: '📢',
    promotion: '🎉',
    reminder: '⏰'
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Send notifications to users</p>
        </div>
        <button className="btn-primary flex items-center">
          <HiPlus className="w-5 h-5 mr-2" />
          Send Notification
        </button>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Sent', value: data?.notifications?.length || 0, color: 'bg-blue-500' },
          { label: 'Tour Updates', value: data?.notifications?.filter(n => n.type === 'tour').length || 0, color: 'bg-green-500' },
          { label: 'Menu Updates', value: data?.notifications?.filter(n => n.type === 'menu').length || 0, color: 'bg-yellow-500' },
          { label: 'Emergency', value: data?.notifications?.filter(n => n.type === 'emergency').length || 0, color: 'bg-red-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <HiBell className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-gray-900">Recent Notifications</h2>
        </div>
        <div className="divide-y">
          {data?.notifications?.slice(0, 20).map((notification) => (
            <div key={notification._id} className="p-4 hover:bg-gray-50 flex items-start justify-between">
              <div className="flex items-start">
                <span className="text-2xl mr-3">{typeIcons[notification.type] || '📢'}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{notification.title?.en}</h4>
                  <p className="text-sm text-gray-500 line-clamp-1">{notification.message?.en}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-400 space-x-3">
                    <span>{new Date(notification.createdAt).toLocaleString()}</span>
                    <span>Sent: {notification.totalSent}</span>
                    <span>Read: {notification.totalRead}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-red-600">
                <HiTrash className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;

