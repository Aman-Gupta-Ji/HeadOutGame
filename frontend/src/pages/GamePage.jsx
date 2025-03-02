import { useEffect, useState, useCallback } from 'react';
import GameCard from '../components/GameCard';
import Confetti from '../components/Confetti';
import GameOverModal from '../components/GameOverModal';
import GameHeader from '../components/GameHeader';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function GamePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const totalQuestions = questions.length;

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
        return;
      }
      
      const baseUrl = process.env.REACT_APP_API_URL || 'https://globerotter-backend.onrender.com';
      const response = await axios.get(`${baseUrl}/api/game/questions`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
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
  }, []);

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
      // Cancel any pending requests
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
          onRestart={resetGame}
          onShare={() => {
            const message = score === totalQuestions * 10
              ? `I got a perfect score in Globetrotter! Can you beat my ${score} points? 🌍 ${window.location.origin}`
              : `I scored ${score} points in Globetrotter! Try to beat me: ${window.location.origin}`;

            window.open(
              `https://wa.me/?text=${encodeURIComponent(message)}`,
              '_blank'
            );
          }}
        />
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