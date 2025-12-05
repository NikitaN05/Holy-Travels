import React from 'react';
import { useQuery } from 'react-query';
import { HiPlus, HiChartBar, HiEye, HiStop } from 'react-icons/hi';
import api from '../../services/api';

const AdminPolls = () => {
  const { data } = useQuery('adminPolls', () =>
    api.get('/polls/admin/all').then(res => res.data.data)
  );

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    active: 'bg-green-100 text-green-700',
    ended: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Polls Management</h1>
          <p className="text-gray-600">Create and manage destination polls</p>
        </div>
        <button className="btn-primary flex items-center">
          <HiPlus className="w-5 h-5 mr-2" />
          Create Poll
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data?.polls?.map((poll) => (
          <div key={poll._id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[poll.status]}`}>
                  {poll.status}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-2">{poll.title?.en}</h3>
                <p className="text-gray-500 text-sm">{poll.question?.en}</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600">
                  <HiEye className="w-5 h-5" />
                </button>
                {poll.status === 'active' && (
                  <button className="p-2 text-gray-400 hover:text-red-600">
                    <HiStop className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {poll.options?.map((option, i) => (
                <div key={i} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{option.destination?.name?.en}</span>
                    <span className="text-sm font-medium text-gray-900">{option.voteCount} votes</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-saffron-500 rounded-full"
                      style={{ width: `${poll.totalVotes > 0 ? (option.voteCount / poll.totalVotes) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
              <div className="flex items-center">
                <HiChartBar className="w-4 h-4 mr-1" />
                {poll.totalVotes} total votes
              </div>
              <span>
                Ends: {new Date(poll.endDate).toLocaleDateString('en-IN')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPolls;

