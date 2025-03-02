import { motion } from "framer-motion";
import { FiGlobe, FiPlay, FiShare2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-headout-bg to-white overflow-hidden">
      {/* Background Pattern - No images needed */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-headout-purple/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-headout-purple/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-headout-light/5 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center relative">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-8 bg-white px-6 py-3 rounded-full shadow-sm border border-headout-purple/10">
            <FiGlobe className="text-2xl text-headout-purple" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-headout-purple to-headout-dark bg-clip-text text-transparent">Globetrotter Challenge</h1>
          </div>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Test your travel knowledge with 10 cryptic destination puzzles. Can
            you score 100/100 and outsmart your friends?
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-headout-purple text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-headout-purple/20"
              onClick={() => navigate(isAuthenticated ? "/play" : "/signin")}
            >
              <FiPlay className="text-xl" />
              Play Now
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-headout-purple px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 shadow-sm border border-headout-purple/20"
              onClick={() => navigate("/share")}
            >
              <FiShare2 className="text-xl" />
              Challenge Friends
            </motion.button>
          </div>

          {/* Animated Globe - SVG instead of image */}
          <div className="flex justify-center">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, repeatType: "reverse" }
              }}
              className="w-48 h-48 relative"
            >
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                  <linearGradient id="globeGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8000FF" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#6600CC" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="80" fill="url(#globeGradient2)" />
                
                {/* Grid lines */}
                <path d="M100 20 Q130 60 100 100 Q70 140 100 180" fill="none" stroke="#8000FF" strokeWidth="1" strokeOpacity="0.2" />
                <path d="M100 20 Q70 60 100 100 Q130 140 100 180" fill="none" stroke="#8000FF" strokeWidth="1" strokeOpacity="0.2" />
                <path d="M20 100 Q60 70 100 100 Q140 130 180 100" fill="none" stroke="#8000FF" strokeWidth="1" strokeOpacity="0.2" />
                <path d="M20 100 Q60 130 100 100 Q140 70 180 100" fill="none" stroke="#8000FF" strokeWidth="1" strokeOpacity="0.2" />
                
                {/* Continents */}
                <path d="M90 60 Q100 55 110 60 Q115 70 110 80 Q100 85 90 80 Q85 70 90 60Z" fill="#8000FF" fillOpacity="0.3" />
                <path d="M65 90 Q75 85 85 90 Q90 100 85 110 Q75 115 65 110 Q60 100 65 90Z" fill="#8000FF" fillOpacity="0.3" />
                <path d="M115 90 Q125 85 135 90 Q140 100 135 110 Q125 115 115 110 Q110 100 115 90Z" fill="#8000FF" fillOpacity="0.3" />
                <path d="M90 120 Q100 115 110 120 Q115 130 110 140 Q100 145 90 140 Q85 130 90 120Z" fill="#8000FF" fillOpacity="0.3" />
                
                <circle cx="100" cy="100" r="80" fill="none" stroke="#8000FF" strokeWidth="1.5" strokeOpacity="0.3" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 text-left mb-24">
          <motion.div 
            className="p-6 bg-white rounded-xl shadow-sm border border-headout-purple/10 hover:shadow-md hover:border-headout-purple/20 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <h3 className="font-bold mb-3 text-headout-purple">🌍 100+ Destinations</h3>
            <p className="text-gray-600">
              From iconic landmarks to hidden gems
            </p>
          </motion.div>
          <motion.div 
            className="p-6 bg-white rounded-xl shadow-sm border border-headout-purple/10 hover:shadow-md hover:border-headout-purple/20 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <h3 className="font-bold mb-3 text-headout-purple">🎮 10 Questions per Quiz</h3>
            <p className="text-gray-600">
              Test your knowledge with 10 carefully selected questions. Think
              fast, guess wisely, and aim for the highest score!
            </p>
          </motion.div>
          <motion.div 
            className="p-6 bg-white rounded-xl shadow-sm border border-headout-purple/10 hover:shadow-md hover:border-headout-purple/20 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <h3 className="font-bold mb-3 text-headout-purple">🏆 Live Leaderboards</h3>
            <p className="text-gray-600">Compete with friends globally</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}