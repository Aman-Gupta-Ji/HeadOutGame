module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Scan all JS/JSX files in src/
  ],
  theme: {
    extend: {
      colors: {
        headout: {
          purple: '#8000FF',  // Headout's primary brand color
          light: '#9933FF',   // Lighter shade for hover states, etc.
          dark: '#6600CC',    // Darker shade for pressed states
          bg: '#F5F0FF',      // Very light purple for backgrounds
        },
      },
      keyframes: {
        'score-pop': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        'float-in': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'rubber-band': {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scaleX(1.25) scaleY(0.75)' },
          '40%': { transform: 'scaleX(0.75) scaleY(1.25)' },
          '50%': { transform: 'scaleX(1.15) scaleY(0.85)' },
          '65%': { transform: 'scaleX(0.95) scaleY(1.05)' },
          '75%': { transform: 'scaleX(1.05) scaleY(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'score-pop': 'score-pop 0.5s ease-out',
        'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-in': 'float-in 0.6s ease-out',
        'spin-slow': 'spin-slow 8s linear infinite',
        'rubber-band': 'rubber-band 0.8s ease-out',
      }
    }
  },
  plugins: [],
}