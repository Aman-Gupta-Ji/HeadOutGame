import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';
import axios from 'axios';
import { ENDPOINTS } from '../config/api';

export default function GameCard({ id, clues, options, onGuess }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [fact, setFact] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [revealedClues, setRevealedClues] = useState(1); // Start with 1 clue revealed

  // Handle user's answer selection
  const handleGuess = async (userGuess) => {
    setSelectedAnswer(userGuess);
    setIsLoading(true);

    try {
      // Send the user's answer to the server
      const response = await axios.post(
        ENDPOINTS.CHECK_ANSWERS,
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
        setRevealedClues(1); // Reset clues for next question
      }, 2500);
    } catch (error) {
      console.error('Error checking answer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reveal additional clue after delay if player hasn't answered yet
  useEffect(() => {
    if (!selectedAnswer && revealedClues < clues.length) {
      const timer = setTimeout(() => {
        setRevealedClues(prev => Math.min(prev + 1, clues.length));
      }, 12000); // Reveal next clue after 12 seconds
      
      return () => clearTimeout(timer);
    }
  }, [revealedClues, selectedAnswer, clues.length]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow-lg">
      {/* Clues Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
          <span className="text-headout-purple mr-2">🔍</span>
          <span>Clues</span>
        </h2>
        <ul className="space-y-2">
          {clues.slice(0, revealedClues).map((clue, index) => (
            <motion.li 
              key={index} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-gray-600 italic p-3 bg-headout-bg rounded-lg"
            >
              "{clue}"
            </motion.li>
          ))}
        </ul>
        
        {/* Clue Indicator */}
        {revealedClues < clues.length && !selectedAnswer && (
          <div className="mt-3 text-sm text-gray-500 flex items-center">
            <motion.div 
              className="w-2 h-2 bg-headout-purple/70 rounded-full mr-2" 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Next clue loading...
          </div>
        )}
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
            
            {/* Animated feedback icons */}
            {selectedAnswer === option && (
              <motion.span 
                className="float-right"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {isCorrect ? '✓' : '✗'}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Feedback Section */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}