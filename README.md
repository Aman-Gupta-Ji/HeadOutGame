# 🌎 Globetrotter Challenge

A full-stack travel destination guessing game where users are presented with cryptic clues about famous places and must guess the location.

## 🚀 Features

- **Engaging Gameplay:** Test your geography knowledge with cryptic clues about destinations around the world
- **AI-Generated Content:** 100+ destinations with unique clues, facts, and trivia
- **Visual Feedback:** Confetti animations for correct answers with fun facts revealed
- **Challenge Friends:** Create unique challenge links to share via WhatsApp
- **Leaderboards:** Compete with other players globally
- **Responsive Design:** Play on any device with a beautiful, intuitive interface

## 🛠️ Tech Stack

### Backend
- **Node.js & Express:** Server framework
- **MongoDB:** Database for storing destinations, users, and challenges
- **OpenAI API:** Used for generating high-quality destination content
- **JWT Auth:** Secure user authentication

### Frontend
- **React.js:** Frontend framework
- **Tailwind CSS:** Styling with custom Headout theme
- **Framer Motion:** Smooth animations and transitions
- **React Router:** Client-side routing

## 🖥️ Screenshots

![Gameplay](screenshots/gameplay.png)
![Challenge](screenshots/challenge.png)
![Leaderboard](screenshots/leaderboard.png)

## 📊 Data Generation System

The game features a comprehensive data generation system that:

- Creates 100+ travel destinations across all continents
- Utilizes OpenAI API to generate realistic and engaging content
- Assigns appropriate difficulty levels (easy, medium, hard)
- Ensures data quality through validation and cleanup scripts

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local installation or Atlas connection)
- npm or yarn

### Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/globetrotter-challenge.git
   cd globetrotter-challenge
   ```

2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Create a `.env` file in the project root with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES=7d
   ```

4. Generate destination data:
   ```bash
   npm run setup-data
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. The application will be available at:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd frontend && npm test
```

## 🚢 Deployment

The application is ready for deployment on platforms like Heroku, Vercel, or Railway:

```bash
# Build frontend for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
globetrotter/
├── backend/                # Backend code
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Express middlewares
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── scripts/            # Data generation scripts
├── frontend/               # React frontend
│   ├── public/             # Static files
│   └── src/                # React components & logic
│       ├── components/     # Reusable components
│       ├── context/        # Context providers
│       ├── pages/          # Page components
│       ├── routes/         # Route definitions
│       └── schemas/        # Validation schemas
├── data/                   # Generated data
├── server.js               # Express server entry point
└── package.json            # Project dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [OpenAI](https://openai.com/) - For AI content generation
- [Headout](https://www.headout.com/) - For design inspiration
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [React Icons](https://react-icons.github.io/react-icons/) - For UI icons