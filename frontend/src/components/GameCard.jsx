import { useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from './Confetti';
import axios from 'axios';

export default function GameCard({ id, clues, options, onGuess }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [fact, setFact] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle user's answer selection
  const handleGuess = async (userGuess) => {
    setSelectedAnswer(userGuess);
    setIsLoading(true);

    try {
      // Send the user's answer to the server
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'https://globerotter-backend.onrender.com'}/api/game/check-answers`,
        {
          id,
          answer: userGuess,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const result = response.data;

      // Update state based on the server's response
      onGuess(result.correct);
      setIsCorrect(result.correct);
      setFact(result.fact);
      setShowFeedback(true);

      // Reset after 2.5 seconds
      setTimeout(() => {
        setSelectedAnswer(null);
        setShowFeedback(false);
      }, 2500);
    } catch (error) {
      console.error('Error checking answer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow-lg">
      {/* Clues Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
          <span className="text-headout-purple mr-2">🔍</span>
          <span>Clues</span>
        </h2>
        <ul className="space-y-2">
          {clues.map((clue, index) => (
            <li key={index} className="text-gray-600 italic p-3 bg-headout-bg rounded-lg">
              "{clue}"
            </li>
          ))}
        </ul>
      </div>

      {/* Answer Options */}
      <div className="grid gap-3">
        {options.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`p-3 rounded-lg text-left transition-colors ${
              selectedAnswer === option
                ? isCorrect
                  ? 'bg-headout-purple text-white'
                  : 'bg-red-500 text-white'
                : 'bg-headout-bg hover:bg-headout-light/20 border border-headout-purple/20'
            }`}
            onClick={() => handleGuess(option)}
            disabled={selectedAnswer !== null || isLoading}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {/* Feedback Section */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-lg bg-headout-bg"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">
              {isCorrect ? '🎉' : '😢'}
            </span>
            <p className="font-bold text-headout-purple">
              {isCorrect ? 'Correct! Well done!' : 'Oops! Try again!'}
            </p>
          </div>

          {/* Fun Fact */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-headout-purple">
              <span className="font-semibold">📚 Did You Know?</span>
              <div className="flex-1 border-t border-dashed border-headout-purple/30"></div>
            </div>
            <p className="text-gray-700 leading-relaxed p-3 bg-white rounded-lg border border-headout-purple/10">
              {fact}
            </p>
          </div>

          {/* Confetti Animation */}
          {isCorrect && <Confetti />}
        </motion.div>
      )}
    </div>
  );
}