import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import UserAvatar from '../components/useAvatar';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [stats, setStats] = useState({
    totalPlayed: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    avgScore: 0,
    challenges: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  
  const apiUrl = process.env.REACT_APP_API_URL || 'https://globerotter-backend.onrender.com';

  // Fetch user stats 
  const fetchUserStats = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/user/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setStats({
          totalPlayed: response.data.questionsAttempted || 0,
          correctAnswers: response.data.correctAnswers || 0,
          wrongAnswers: response.data.wrongAnswers || 0,
          avgScore: response.data.averageScore || 0,
          challenges: response.data.activeChallenges || 0
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      toast.error('Could not load your profile data');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  // Fetch user stats when component mounts
  useEffect(() => {
    if (user) {
      fetchUserStats();
      setFormData({
        username: user.username || '',
        email: user.email || ''
      });
    }
  }, [user, fetchUserStats]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const success = await updateProfile(formData);
      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-headout-bg/20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-headout-purple"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-headout-bg/20 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
        >
          <div className="p-8">
            <div className="flex items-center">
              <div className="mr-6">
                <UserAvatar size="xl" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800">{user?.username || 'User'}</h1>
                <p className="text-gray-500">{user?.email || 'No email available'}</p>
                
                <div className="mt-4">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-headout-purple hover:underline text-sm flex items-center"
                  >
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                  </button>
                </div>
              </div>
              
              <div>
                <div className="text-center bg-headout-bg p-4 rounded-lg">
                  <div className="text-3xl font-bold text-headout-purple">{stats.avgScore}</div>
                  <div className="text-sm text-gray-500">Avg. Score</div>
                </div>
              </div>
            </div>
            
            {isEditing && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-8 p-4 border border-headout-purple/20 rounded-lg"
              >
                <h2 className="font-bold text-lg mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-headout-purple"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-headout-purple"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-headout-purple text-white px-4 py-2 rounded-lg hover:bg-headout-dark"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Game Statistics</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-headout-bg/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-headout-purple">{stats.totalPlayed}</div>
                  <div className="text-sm text-gray-500">Games Played</div>
                </div>
                <div className="bg-headout-bg/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.correctAnswers}</div>
                  <div className="text-sm text-gray-500">Correct Answers</div>
                </div>
                <div className="bg-headout-bg/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-500">{stats.wrongAnswers}</div>
                  <div className="text-sm text-gray-500">Wrong Answers</div>
                </div>
                <div className="bg-headout-bg/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-headout-purple">{stats.challenges}</div>
                  <div className="text-sm text-gray-500">Active Challenges</div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => window.location.href = '/play'}
                  className="bg-headout-purple text-white px-6 py-2 rounded-lg hover:bg-headout-dark transition-colors"
                >
                  Play Another Game
                </button>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Achievements</h2>
              
              <div className="space-y-4">
                <AchievementItem 
                  title="Globetrotter Novice" 
                  description="Played 10+ games" 
                  isUnlocked={stats.totalPlayed >= 10} 
                />
                <AchievementItem 
                  title="Geography Whiz" 
                  description="Achieved a 90+ score" 
                  isUnlocked={stats.avgScore >= 90} 
                />
                <AchievementItem 
                  title="Challenge Creator" 
                  description="Created your first challenge" 
                  isUnlocked={stats.challenges > 0} 
                />
                <AchievementItem 
                  title="Perfect Game" 
                  description="Scored 100/100 in a game" 
                  isUnlocked={stats.avgScore === 100} 
                />
              </div>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => window.location.href = '/share'}
                  className="border border-headout-purple text-headout-purple px-6 py-2 rounded-lg hover:bg-headout-bg transition-colors"
                >
                  Challenge Friends
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function AchievementItem({ title, description, isUnlocked }) {
  return (
    <div className={`flex items-center p-3 rounded-lg ${isUnlocked ? 'bg-headout-bg' : 'bg-gray-100'}`}>
      <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
        isUnlocked ? 'bg-headout-purple text-white' : 'bg-gray-300 text-gray-500'
      }`}>
        {isUnlocked ? '✓' : '?'}
      </div>
      <div>
        <div className={`font-medium ${isUnlocked ? 'text-headout-purple' : 'text-gray-400'}`}>{title}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </div>
  );
}