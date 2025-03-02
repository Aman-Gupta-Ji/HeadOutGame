const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const auth = require("./routes/authRoute.js");
const gameRoute = require("./routes/gameRoute.js");
const leaderboardRoutes = require("./routes/leaderboardRoute.js");
const challengeRoutes = require("./routes/challengeRoute.js");
const userRoutes = require('./routes/user.js');
const cors = require("cors");
const path = require("path");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

// Session Middleware
app.use(
  session({
    secret: process.env.SECRET_KEY || "globetrotter-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: { 
      secure: process.env.NODE_ENV === 'production', 
      httpOnly: true, 
      maxAge: 1000 * 60 * 60 * 24 // 1-day expiration
    },
  })
);

// API routes
app.use("/api/auth", auth);
app.use('/api/game', gameRoute);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/user", userRoutes);
app.use("/api/challenges", challengeRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Globetrotter API is running", status: "healthy" });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Something went wrong on the server",
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`));