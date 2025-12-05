import React from 'react';
import { useQuery } from 'react-query';
import { HiExclamation, HiCheck, HiPhone, HiLocationMarker } from 'react-icons/hi';
import api from '../../services/api';

const AdminEmergency = () => {
  const { data: activeAlerts } = useQuery('activeEmergencies', () =>
    api.get('/emergency/active').then(res => res.data.data)
  );

  const { data: allAlerts } = useQuery('allEmergencies', () =>
    api.get('/emergency/all').then(res => res.data.data)
  );

  const statusColors = {
    active: 'bg-red-500 text-white animate-pulse',
    acknowledged: 'bg-yellow-500 text-white',
    responding: 'bg-blue-500 text-white',
    resolved: 'bg-green-500 text-white',
    false_alarm: 'bg-gray-500 text-white'
  };

  const severityColors = {
    critical: 'border-red-500 bg-red-50',
    high: 'border-orange-500 bg-orange-50',
    medium: 'border-yellow-500 bg-yellow-50',
    low: 'border-blue-500 bg-blue-50'
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Emergency Alerts</h1>
        <p className="text-gray-600">Monitor and respond to emergency situations</p>
      </div>

      {/* Active Alerts */}
      {activeAlerts?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center">
            <HiExclamation className="w-6 h-6 mr-2 animate-pulse" />
            Active Alerts ({activeAlerts.length})
          </h2>
          <div className="grid gap-4">
            {activeAlerts.map((alert) => (
              <div
                key={alert._id}
                className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${severityColors[alert.severity]}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 animate-pulse">
                      <HiExclamation className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-gray-900">{alert.user?.name}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[alert.status]}`}>
                          {alert.status.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 capitalize">
                          {alert.type}
                        </span>
                      </div>
                      <p className="text-gray-600">{alert.description || 'Emergency SOS triggered'}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <HiPhone className="w-4 h-4 mr-1" />
                          {alert.user?.phone}
                        </span>
                        {alert.location?.address && (
                          <span className="flex items-center">
                            <HiLocationMarker className="w-4 h-4 mr-1" />
                            {alert.location.address}
                          </span>
                        )}
                        <span>{new Date(alert.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {alert.status === 'active' && (
                      <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                        Acknowledge
                      </button>
                    )}
                    {alert.status !== 'resolved' && (
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center">
                        <HiCheck className="w-4 h-4 mr-1" />
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Alerts History */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-gray-900">Alert History</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {allAlerts?.emergencies?.map((alert) => (
              <tr key={alert._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{alert.user?.name}</p>
                  <p className="text-sm text-gray-500">{alert.user?.phone}</p>
                </td>
                <td className="px-6 py-4 capitalize text-gray-600">{alert.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {alert.severity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[alert.status]}`}>
                    {alert.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(alert.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {alert.resolvedAt ? `${Math.round((new Date(alert.resolvedAt) - new Date(alert.createdAt)) / 60000)} min` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEmergency;

