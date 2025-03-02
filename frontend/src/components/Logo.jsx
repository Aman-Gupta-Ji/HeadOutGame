import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="h-12 w-12 relative"
    >
      {/* SVG globe directly in component - no external image needed */}
      <svg 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="globeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8000FF" />
            <stop offset="100%" stopColor="#6600CC" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="40" fill="url(#globeGradient)" />
        
        {/* Longitude lines */}
        <path d="M50 10 Q65 30 50 50 Q35 70 50 90" fill="none" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.7" />
        <path d="M50 10 Q35 30 50 50 Q65 70 50 90" fill="none" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.7" />
        
        {/* Latitude lines */}
        <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.7" />
        <ellipse cx="50" cy="50" rx="20" ry="7.5" fill="none" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.7" />
        
        {/* Outline */}
        <circle cx="50" cy="50" r="40" fill="none" stroke="#fff" strokeWidth="2" />
      </svg>
    </motion.div>
  );
}