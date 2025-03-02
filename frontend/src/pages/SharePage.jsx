import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiEdit3 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function SharePage() {
  const [challengeId, setChallengeId] = useState(null);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [showChallenges, setShowChallenges] = useState(false);
  
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const shareCardRef = useRef(null);
  
  const baseUrl = window.location.origin;
  const apiUrl = process.env.REACT_APP_API_URL || 'https://globerotter-backend.onrender.com';

  // Create a new challenge
  const createChallenge = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${apiUrl}/api/challenges`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      if (response.data?.success) {
        const { challenge_id } = response.data.challenge;
        setChallengeId(challenge_id);
        setShareLink(`${baseUrl}/challenge/${challenge_id}`);
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast.error('Failed to create challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, baseUrl]);

  // Fetch user's active challenges
  const fetchUserChallenges = useCallback(async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/challenges/user/active`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      if (response.data?.success) {
        setChallenges(response.data.challenges);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  }, [apiUrl]);

  // Create new challenge on mount
  useEffect(() => {
    if (isAuthenticated) {
      createChallenge();
      fetchUserChallenges();
    }
  }, [isAuthenticated, createChallenge, fetchUserChallenges]);

  // Copy share link to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Share on WhatsApp
  const shareOnWhatsApp = () => {
    const text = `Hey! I challenge you to beat my score in Globetrotter Challenge! Click the link to play: ${shareLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-headout-bg to-white p-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-4"
        >
          Challenge Your Friends!
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 mb-8"
        >
          Share your Globetrotter Challenge and see if your friends can beat your score!
        </motion.p>

        {/* Share Card Preview - This will be captured for sharing */}
        <motion.div
          ref={shareCardRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-8 mb-8 shadow-lg border-2 border-headout-purple/20"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 bg-headout-purple rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.username?.[0]?.toUpperCase() || '?'}
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-headout-purple mb-2">
            {user?.username || 'Player'}'s Challenge
          </h2>
          
          <p className="text-gray-600 mb-4">
            Think you know your travel destinations? Play Globetrotter Challenge and prove it!
          </p>
          
          <div className="p-3 bg-headout-bg rounded-lg text-center mb-4">
            <p className="text-sm text-gray-500">Scan or click the link to play</p>
          </div>
          
          <div className="text-xs text-gray-400">
            Challenge expires in 7 days
          </div>
        </motion.div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center mb-6">
            <div className="w-8 h-8 border-2 border-headout-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Share Options */}
        {!loading && shareLink && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Copy Link */}
            <div className="relative">
              <input
                value={shareLink}
                readOnly
                className="w-full p-3 bg-headout-bg rounded-lg pr-24"
              />
              <button
                onClick={handleCopy}
                className="absolute right-2 top-2 bg-white px-4 py-1.5 rounded-md text-sm border flex items-center gap-2 hover:bg-headout-purple hover:text-white transition-colors"
              >
                {copied ? 'Copied!' : <><FiCopy className="mr-1" /> Copy</>}
              </button>
            </div>

            {/* Share Buttons */}
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareOnWhatsApp}
                className="px-6 py-3 bg-[#25D366] text-white rounded-xl shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Share on WhatsApp
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowChallenges(!showChallenges)}
                className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              >
                <FiEdit3 className="text-xl" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* User's active challenges */}
        {showChallenges && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-8 bg-white p-4 rounded-lg shadow-sm"
          >
            <h3 className="text-lg font-bold mb-4">Your Active Challenges</h3>
            
            {challenges.length === 0 ? (
              <p className="text-gray-500">No active challenges found.</p>
            ) : (
              <div className="space-y-3">
                {challenges.map((challenge) => (
                  <div 
                    key={challenge.challenge_id} 
                    className="p-3 border rounded-lg flex justify-between items-center hover:bg-headout-bg/30 transition-colors"
                  >
                    <div>
                      <p className="font-medium">Challenge #{challenge.challenge_id.substring(0, 8)}</p>
                      <p className="text-xs text-gray-500">
                        Times played: {challenge.times_played} | 
                        Expires: {new Date(challenge.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setChallengeId(challenge.challenge_id);
                        setShareLink(`${baseUrl}/challenge/${challenge.challenge_id}`);
                        setShowChallenges(false);
                      }}
                      className="text-headout-purple hover:underline text-sm"
                    >
                      Use this
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/play')}
            className="w-full px-6 py-3 bg-white border-2 border-headout-purple/30 text-headout-purple rounded-xl hover:bg-headout-bg transition-colors"
          >
            Play Another Round
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/profile')}
            className="text-gray-500 hover:text-headout-purple transition-colors"
          >
            View Your Profile
          </motion.button>
        </div>
      </div>
    </div>
  );
}