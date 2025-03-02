import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Confetti from './Confetti';

export default function GameOverModal({ 
  isPerfect, 
  score, 
  totalScore = 100, 
  challengerScore = null,
  isChallenge = false,
  onRestart, 
  onShare 
}) {
  const [beatChallenger, setBeatChallenger] = useState(false);
  
  useEffect(() => {
    // Determine if the player beat the challenger
    if (isChallenge && challengerScore !== null) {
      setBeatChallenger(score > challengerScore);
    }
  }, [isChallenge, challengerScore, score]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-20"
    >
      <motion.div
        initial={{ y: 20, scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        className="bg-white rounded-xl p-8 max-w-md w-full shadow-xl text-center"
      >
        {isPerfect ? (
          <>
            <div className="relative">
              <div className="text-6xl mb-4">🏆</div>
              <motion.div 
                className="absolute -right-4 -top-4 text-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                ✨
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-headout-purple">Flawless Victory!</h2>
            <p className="text-gray-600 mb-6">Perfect {score}/{totalScore} Score!</p>
            <div className="space-y-4">
              <button
                onClick={onShare}
                className="w-full bg-headout-purple text-white px-6 py-3 rounded-lg hover:bg-headout-dark transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Challenge Friends
              </button>
              <button
                onClick={onRestart}
                className="text-headout-purple hover:text-headout-dark underline"
              >
                Play Again
              </button>
            </div>
            
            {/* Perfect score confetti */}
            <Confetti />
          </>
        ) : isChallenge ? (
          <>
            <div className="text-6xl mb-4">{beatChallenger ? '🎉' : '😊'}</div>
            <h2 className="text-2xl font-bold mb-2">
              {beatChallenger ? 'Challenge Completed!' : 'Challenge Completed'}
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="text-4xl font-bold text-headout-purple">{score}</div>
              <div className="text-gray-400 text-xl">/ {totalScore}</div>
            </div>
            
            {challengerScore !== null && (
              <div className="mb-8 p-4 bg-headout-bg rounded-lg">
                <p className="text-gray-700">
                  {beatChallenger 
                    ? `You beat the challenger's score of ${challengerScore}!` 
                    : `The challenger scored ${challengerScore}.`}
                </p>
                
                {beatChallenger && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="mt-2 text-2xl"
                  >
                    🏆
                  </motion.div>
                )}
              </div>
            )}
            
            <div className="space-y-4">
              <button
                onClick={onShare}
                className="w-full bg-headout-purple text-white px-6 py-3 rounded-lg hover:bg-headout-dark transition-colors"
              >
                Create Your Own Challenge
              </button>
              <button
                onClick={onRestart}
                className="w-full border-2 border-headout-purple/30 text-headout-purple px-6 py-3 rounded-lg hover:bg-headout-bg transition-colors"
              >
                Play Again
              </button>
            </div>
            
            {/* Show confetti for beat challenger */}
            {beatChallenger && <Confetti />}
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-2">Game Over</h2>
            <div className="flex items-center justify-center gap-2 mb-6">
              <p className="text-4xl font-bold text-headout-purple">{score}</p>
              <p className="text-gray-400">/ {totalScore}</p>
            </div>
            <div className="space-y-4">
              <button
                onClick={onRestart}
                className="w-full bg-headout-purple text-white px-6 py-3 rounded-lg hover:bg-headout-dark transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onShare}
                className="w-full border-2 border-headout-purple/50 text-headout-purple px-6 py-3 rounded-lg hover:bg-headout-bg transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Challenge Friends
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}