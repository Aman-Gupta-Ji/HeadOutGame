import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCard from '../components/GameCard';
import Confetti from '../components/Confetti';
import GameOverModal from '../components/GameOverModal';
import GameHeader from '../components/GameHeader';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ENDPOINTS } from '../config/api';

export default function GamePage({ isChallenge = false, challengerId = null }) {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [challengerScore, setChallengerScore] = useState(null);
  
  const totalQuestions = 10; // Fixed number of questions per game

  const handleGuess = useCallback((isCorrect) => {
    if (isCorrect) {
      setScore(prev => prev + 10);
      setCorrectAnswers(prev => prev + 1);
      setShowConfetti(true);
    } else {
      setIncorrectAnswers(prev => prev + 1);
    }

    // Move to next question after delay
    setTimeout(() => {
      setShowConfetti(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameOver(true);
      }
    }, 2500);
  }, [currentQuestion, questions.length]);

  const getQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication required');
        navigate('/signin');
        return;
      }
      
      // If this is a challenge, fetch challenger's score
      if (isChallenge && challengerId) {
        try {
          const userResponse = await axios.get(`${ENDPOINTS.USER}/${challengerId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (userResponse.data) {
            setChallengerScore(userResponse.data.score || 0);
          }
        } catch (error) {
          console.error("Error fetching challenger score:", error);
        }
      }
      
      // Get questions for the game
      const response = await axios.get(ENDPOINTS.QUESTIONS, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        params: {
          count: totalQuestions
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        setQuestions(response.data);
      } else {
        toast.error('Invalid question data received');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isChallenge, challengerId, navigate]);

  const resetGame = useCallback(() => {
    setCurrentQuestion(0);
    setGameOver(false);
    setScore(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    getQuestions();
    setShowConfetti(false);
  }, [getQuestions]);

  useEffect(() => {
    getQuestions();
    
    // Clean up function
    return () => {
      // Cancel any pending requests if needed
    };
  }, [getQuestions]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-headout-bg/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-headout-purple mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  // Error state - no questions
  if (!isLoading && (!questions || questions.length === 0)) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-headout-bg/30">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Couldn't Load Questions</h2>
          <p className="text-gray-600 mb-6">We encountered a problem loading the game questions.</p>
          <button 
            onClick={getQuestions}
            className="bg-headout-purple text-white px-6 py-2 rounded-lg hover:bg-headout-dark"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-headout-bg/30 p-4">
      {gameOver && (
        <GameOverModal
          isPerfect={score === totalQuestions * 10}
          score={score}
          totalScore={totalQuestions * 10}
          challengerScore={challengerScore}
          isChallenge={isChallenge}
          onRestart={resetGame}
          onShare={() => navigate('/share', { state: { score } })}
        />
      )}
      
      {isChallenge && challengerScore !== null && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-4 p-3 bg-white rounded-lg shadow-sm flex items-center justify-between"
        >
          <span className="text-sm text-gray-600">Challenge Mode</span>
          <span className="font-medium">Challenger's Score: <span className="text-headout-purple">{challengerScore}</span></span>
        </motion.div>
      )}
      
      <div className="max-w-2xl mx-auto">
        {/* Combined Header */}
        <GameHeader
          score={score}
          totalQuestions={totalQuestions}
          currentQuestion={currentQuestion}
          correctAnswers={correctAnswers}
          incorrectAnswers={incorrectAnswers}
        />

        {/* GameCard */}
        {currentQ && (
          <GameCard
            id={currentQ.id}
            clues={currentQ.clues}
            options={currentQ.options}
            onGuess={handleGuess}
          />
        )}

        {/* Confetti */}
        {showConfetti && <Confetti colors={['#8000FF', '#9933FF', '#6600CC', '#ffffff']} />}
      </div>
    </div>
  );
}