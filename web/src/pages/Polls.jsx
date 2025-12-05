import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import { HiCheck, HiClock, HiChartBar, HiLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { pollsAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const Polls = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: polls, isLoading } = useQuery('activePolls', () =>
    pollsAPI.getActive().then(res => res.data.data)
  );

  const voteMutation = useMutation(
    ({ pollId, optionIndex }) => pollsAPI.vote(pollId, optionIndex),
    {
      onSuccess: () => {
        toast.success(t('poll.voted'));
        queryClient.invalidateQueries('activePolls');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to vote');
      }
    }
  );

  const handleVote = (pollId, optionIndex) => {
    voteMutation.mutate({ pollId, optionIndex });
  };

  const formatTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return 'Ending soon';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-6xl mb-4 block">🗳️</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {t('poll.title')}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {t('poll.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-20 bg-gray-200 rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : polls?.length > 0 ? (
          <div className="space-y-8">
            {polls.map((poll) => (
              <motion.div
                key={poll._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                {/* Poll Header */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-900">
                      {poll.title?.[lang] || poll.title?.en}
                    </h2>
                    <span className="flex items-center text-sm text-gray-500">
                      <HiClock className="w-4 h-4 mr-1" />
                      {formatTimeRemaining(poll.endDate)}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    {poll.question?.[lang] || poll.question?.en}
                  </p>
                </div>

                {/* Poll Options */}
                <div className="p-6 space-y-4">
                  {poll.options?.map((option, index) => {
                    const percentage = poll.totalVotes > 0
                      ? Math.round((option.voteCount / poll.totalVotes) * 100)
                      : 0;
                    const hasVoted = poll.hasVoted;
                    const isSelected = option.votes?.some(v => v.user === user?._id);

                    return (
                      <div key={index} className="relative">
                        <button
                          onClick={() => !hasVoted && handleVote(poll._id, index)}
                          disabled={hasVoted || voteMutation.isLoading}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? 'border-purple-500 bg-purple-50'
                              : hasVoted
                              ? 'border-gray-200 bg-gray-50'
                              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            {option.destination?.image && (
                              <img
                                src={option.destination.image}
                                alt=""
                                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-grow">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-gray-900 flex items-center">
                                  <HiLocationMarker className="w-4 h-4 mr-1 text-purple-500" />
                                  {option.destination?.name?.[lang] || option.destination?.name?.en}
                                </span>
                                {isSelected && (
                                  <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                                    <HiCheck className="w-3 h-3 mr-1" />
                                    Your vote
                                  </span>
                                )}
                              </div>
                              {option.destination?.description && (
                                <p className="text-sm text-gray-600 mb-2">
                                  {option.destination.description?.[lang] || option.destination.description?.en}
                                </p>
                              )}
                              
                              {/* Progress bar - only show if voted or results visible */}
                              {(hasVoted || poll.showResultsBeforeEnd) && (
                                <div className="mt-2">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">{option.voteCount} votes</span>
                                    <span className="font-medium text-purple-600">{percentage}%</span>
                                  </div>
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${percentage}%` }}
                                      transition={{ duration: 0.5, delay: 0.1 }}
                                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Poll Footer */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <HiChartBar className="w-4 h-4 mr-1" />
                    {poll.totalVotes} total votes • {poll.participants?.length || 0} participants
                  </div>
                  {poll.hasVoted && (
                    <span className="text-sm text-green-600 font-medium flex items-center">
                      <HiCheck className="w-4 h-4 mr-1" />
                      {t('poll.voted')}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <span className="text-6xl mb-4 block">🗳️</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Polls</h3>
            <p className="text-gray-600">
              Check back later for new destination polls!
            </p>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-2xl p-6">
          <h3 className="font-bold text-purple-800 mb-3">How it works</h3>
          <ul className="space-y-2 text-purple-700 text-sm">
            <li>• Vote for your favorite destination from the options</li>
            <li>• Each user can vote once per poll</li>
            <li>• The winning destination will be our next tour package!</li>
            <li>• Poll results are visible after you vote</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Polls;

