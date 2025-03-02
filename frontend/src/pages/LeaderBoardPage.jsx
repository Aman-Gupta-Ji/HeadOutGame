import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [sortBy, setSortBy] = useState('top-scores');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeaderboard = useCallback(async (sortType) => {
    try {
      setIsLoading(true);
      const baseUrl = process.env.REACT_APP_API_URL || 'https://globerotter-backend.onrender.com';
      const response = await axios.get(`${baseUrl}/api/leaderboard/${sortType}`);
      
      if (response.data && Array.isArray(response.data)) {
        setLeaderboard(response.data);
      } else {
        toast.error('Invalid leaderboard data received');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to fetch leaderboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(sortBy);
  }, [sortBy, fetchLeaderboard]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const buttonVariants = {
    rest: {
      scale: 1,
      backgroundColor: '#ffffff',
      color: '#4b5563',
      transition: { duration: 0.2 }
    },
    selected: {
      background: 'linear-gradient(45deg, #8000FF, #9933FF)',
      color: '#ffffff',
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.05,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-headout-bg to-white py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-headout-purple to-headout-dark bg-clip-text text-transparent">
          Leaderboard
        </h1>

        {/* Sorting Buttons */}
        <motion.div className="flex flex-wrap gap-4 justify-center mb-8">
          {['top-scores', 'most-correct', 'most-wrong'].map((sortType) => (
            <motion.button
              key={sortType}
              variants={buttonVariants}
              initial="rest"
              animate={sortBy === sortType ? 'selected' : 'rest'}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setSortBy(sortType)}
              className="px-6 py-3 rounded-xl font-semibold shadow-md"
            >
              {sortType === 'top-scores' && '🏆 Most Score'}
              {sortType === 'most-correct' && '✅ Most Correct'}
              {sortType === 'most-wrong' && '❌ Most Wrong'}
            </motion.button>
          ))}
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-6 py-4 bg-gradient-to-r from-headout-purple to-headout-dark">
            <h2 className="text-xl font-bold text-white">
              {sortBy === 'top-scores'
                ? 'Top Scores'
                : sortBy === 'most-correct'
                ? 'Most Correct Answers'
                : 'Most Wrong Answers'}
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-headout-purple"></div>
            </div>
          ) : (
            <>
              {leaderboard.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No data available yet. Be the first to play!</p>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="divide-y divide-gray-100"
                >
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50">
                    <div className="col-span-1 font-semibold text-gray-600">Rank</div>
                    <div className="col-span-8 font-semibold text-gray-600">Username</div>
                    <div className="col-span-3 font-semibold text-gray-600 text-right">
                      {sortBy === 'top-scores'
                        ? 'Score'
                        : sortBy === 'most-correct'
                        ? 'Correct Answers'
                        : 'Wrong Answers'}
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {leaderboard.map((user, index) => (
                      <motion.div
                        key={user.userId || index}
                        variants={rowVariants}
                        className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-headout-bg transition-colors"
                      >
                        <div className="col-span-1 font-medium text-gray-700">{index + 1}</div>
                        <div className="col-span-8 flex items-center">
                          <div className="h-8 w-8 rounded-full bg-headout-purple/20 flex items-center justify-center mr-3">
                            <span className="text-headout-purple font-semibold">
                              {user.username ? user.username[0].toUpperCase() : '?'}
                            </span>
                          </div>
                          <span className="font-medium">{user.username || 'Anonymous'}</span>
                        </div>
                        <div className="col-span-3 text-right font-semibold text-headout-purple">
                          {sortBy === 'top-scores'
                            ? user.score
                            : sortBy === 'most-correct'
                            ? user.correctAnswers
                            : user.wrongAnswers}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;