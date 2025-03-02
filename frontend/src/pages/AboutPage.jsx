import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-headout-bg to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
        >
          <div className="p-8">
            <h1 className="text-3xl font-bold text-headout-purple mb-6">About Globetrotter Challenge</h1>
            
            <p className="text-gray-700 mb-4">
              Globetrotter Challenge is an engaging travel destination guessing game that tests your knowledge of geography and famous landmarks around the world.
            </p>
            
            <p className="text-gray-700 mb-4">
              Our mission is to make learning about world geography fun and interactive. Each puzzle presents you with cryptic clues about a famous destination, and it's your job to figure out where in the world it is!
            </p>

            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">How to Play</h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>Read the cryptic clues about a mystery destination</li>
              <li>Choose from multiple options to guess the correct location</li>
              <li>Earn points for correct answers</li>
              <li>Learn interesting facts about each destination</li>
              <li>Challenge friends to beat your score</li>
            </ol>

            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">Features</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>100+ destinations with unique clues and facts</li>
              <li>Progressive difficulty levels</li>
              <li>Global leaderboards</li>
              <li>Challenge sharing via WhatsApp</li>
              <li>Fun facts and trivia for every destination</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-xl font-bold text-headout-purple mb-4">Our Team</h2>
            <p className="text-gray-700 mb-6">
              Globetrotter Challenge was created by a passionate team of developers at Headout who love travel and geography.
            </p>
            
            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              Have suggestions or feedback? We'd love to hear from you! Email us at <a href="mailto:support@globetrotter-challenge.com" className="text-headout-purple hover:underline">support@globetrotter-challenge.com</a>.
            </p>
            
            <div className="mt-8 p-6 bg-headout-bg rounded-lg text-center">
              <p className="text-lg font-medium text-headout-purple">
                Ready to test your geography knowledge?
              </p>
              <button
                onClick={() => window.location.href = '/play'}
                className="mt-4 px-6 py-2 bg-headout-purple text-white rounded-lg hover:bg-headout-dark transition-colors"
              >
                Play Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}