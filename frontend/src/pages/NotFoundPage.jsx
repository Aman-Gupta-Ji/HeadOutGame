import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-headout-bg/30 p-4">
      <motion.div 
        className="text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* SVG Globe with question mark */}
        <div className="mx-auto w-52 h-52 mb-6 relative">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="globeGradient404" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8000FF" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#6600CC" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="url(#globeGradient404)" />
            
            {/* Grid lines */}
            <path d="M100 20 Q130 60 100 100 Q70 140 100 180" fill="none" stroke="#8000FF" strokeWidth="1" strokeOpacity="0.3" />
            <path d="M100 20 Q70 60 100 100 Q130 140 100 180" fill="none" stroke="#8000FF" strokeWidth="1" strokeOpacity="0.3" />
            <path d="M20 100 Q60 70 100 100 Q140 130 180 100" fill="none" stroke="#8000FF" strokeWidth="1" strokeOpacity="0.3" />
            <path d="M20 100 Q60 130 100 100 Q140 70 180 100" fill="none" stroke="#8000FF" strokeWidth="1" strokeOpacity="0.3" />
            
            <circle cx="100" cy="100" r="80" fill="none" stroke="#8000FF" strokeWidth="1.5" strokeOpacity="0.4" />
            
            {/* Question mark */}
            <text x="100" y="120" fontSize="80" fontWeight="bold" textAnchor="middle" fill="#8000FF" fillOpacity="0.6">?</text>
          </svg>
        </div>
        
        <motion.h1 
          className="text-5xl font-bold text-headout-purple mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          404
        </motion.h1>
        
        <motion.p
          className="text-xl text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Oops! This destination isn't on our map.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            to="/"
            className="inline-block bg-headout-purple text-white px-8 py-3 rounded-lg hover:bg-headout-dark transition-colors shadow-lg shadow-headout-purple/20"
          >
            Back to Homepage
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}