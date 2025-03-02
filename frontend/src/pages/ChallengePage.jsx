import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import GamePage from './GamePage';

export default function ChallengePage() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptingChallenge, setAcceptingChallenge] = useState(false);
  
  const apiUrl = process.env.REACT_APP_API_URL || 'https://globerotter-backend.onrender.com';

  // Fetch challenge data
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(
          `${apiUrl}/api/challenges/${challengeId}`
        );
        
        if (response.data?.success) {
          setChallenge(response.data.challenge);
        } else {
          setError('Challenge could not be loaded.');
        }
      } catch (error) {
        console.error('Error fetching challenge:', error);
        if (error.response?.status === 404) {
          setError('This challenge does not exist or has expired.');
        } else {
          setError('An error occurred while loading the challenge.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchChallenge();
  }, [challengeId, apiUrl]);

  // Handle accepting the challenge
  const handleAcceptChallenge = () => {
    if (!isAuthenticated) {
      // Redirect to login, passing the challenge ID to redirect back after
      navigate('/signin', { state: { from: `/challenge/${challengeId}` } });
      return;
    }
    
    setAcceptingChallenge(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-headout-bg/20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-headout-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading challenge...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="text-5xl mb-4">😢</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Challenge Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-headout-purple text-white px-6 py-3 rounded-lg hover:bg-headout-dark"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // If user accepted the challenge, show the GamePage
  if (acceptingChallenge) {
    return <GamePage isChallenge challengerId={challenge.challenger._id} />;
  }

  // Challenge invitation view
  return (
    <div className="min-h-screen bg-gradient-to-b from-headout-bg to-white p-4 flex justify-center items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-white rounded-xl p-8 shadow-lg"
      >
        {/* Challenge Header */}
        <div className="text-center mb-6">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-headout-bg rounded-full mb-4"
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-2xl"
            >
              🌍
            </motion.div>
            <h2 className="font-semibold text-headout-purple">Globetrotter Challenge</h2>
          </motion.div>
          
          <h1 className="text-2xl font-bold mb-1">You've Been Challenged!</h1>
          <p className="text-gray-600">
            {challenge.challenger.username} has challenged you to a game of geographic knowledge
          </p>
        </div>
        
        {/* Challenger Stats */}
        <div className="mb-8 p-4 bg-headout-bg rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-headout-purple rounded-full flex items-center justify-center text-white font-bold text-lg">
              {challenge.challenger.username[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold">{challenge.challenger.username}'s Stats</h3>
              <p className="text-sm text-gray-600">Can you beat their score?</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 bg-white rounded-md">
              <div className="text-xl font-bold text-headout-purple">{challenge.challenger.score || 0}</div>
              <div className="text-xs text-gray-500">Score</div>
            </div>
            <div className="p-2 bg-white rounded-md">
              <div className="text-xl font-bold text-green-600">{challenge.challenger.correctAnswers || 0}</div>
              <div className="text-xs text-gray-500">Correct</div>
            </div>
            <div className="p-2 bg-white rounded-md">
              <div className="text-xl font-bold">{challenge.challenger.questionsAttempted || 0}</div>
              <div className="text-xs text-gray-500">Played</div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-headout-purple text-white py-3 rounded-lg font-semibold shadow-md hover:bg-headout-dark transition-colors"
            onClick={handleAcceptChallenge}
          >
            Accept Challenge 🎮
          </motion.button>
          
          <button
            className="w-full text-gray-500 hover:text-headout-purple"
            onClick={() => navigate('/')}
          >
            Play Regular Game Instead
          </button>
        </div>
        
        {/* Challenge Info */}
        <div className="mt-6 text-xs text-center text-gray-400">
          <p>Challenge created {new Date(challenge.created_at).toLocaleDateString()}</p>
          <p>Expires {new Date(challenge.expires_at).toLocaleDateString()}</p>
          <p>Played {challenge.times_played} times</p>
        </div>
      </motion.div>
    </div>
  );
}