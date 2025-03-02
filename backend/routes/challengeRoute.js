const express = require("express");
const router = express.Router();
const Challenge = require("../models/Challenge");
const User = require("../models/User");
const protect = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");

/**
 * @route   POST /api/challenges
 * @desc    Create a new challenge
 * @access  Private
 */
router.post("/", protect, async (req, res) => {
  try {
    // Create a new challenge with the authenticated user as challenger
    const challenge = new Challenge({
      challenger: req.user._id
    });
    
    await challenge.save();
    
    // Return the challenge with its unique URL-friendly ID
    res.status(201).json({
      success: true,
      challenge: {
        challenge_id: challenge.challenge_id,
        created_at: challenge.created_at,
        expires_at: challenge.expires_at
      }
    });
  } catch (error) {
    console.error("Challenge creation error:", error);
    res.status(500).json({ message: "Failed to create challenge", error: error.message });
  }
});

/**
 * @route   GET /api/challenges/:challengeId
 * @desc    Get a challenge by ID and challenger info
 * @access  Public
 */
router.get("/:challengeId", async (req, res) => {
  try {
    const { challengeId } = req.params;
    
    // Find the challenge by its unique ID
    const challenge = await Challenge.findOne({ challenge_id: challengeId });
    
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found or has expired" });
    }
    
    // Find the challenger's user info to include their username and score
    const challenger = await User.findById(challenge.challenger);
    
    if (!challenger) {
      return res.status(404).json({ message: "Challenger information not available" });
    }

    // Get the challenger's score from the leaderboard
    const leaderboardEntry = await mongoose.model('Leaderboard').findOne({ userId: challenger._id });
    
    // Update the times played count
    challenge.times_played += 1;
    await challenge.save();
    
    // Return challenge info with challenger details
    res.json({
      success: true,
      challenge: {
        challenge_id: challenge.challenge_id,
        challenger: {
          username: challenger.username,
          score: leaderboardEntry ? leaderboardEntry.score : 0,
          correctAnswers: leaderboardEntry ? leaderboardEntry.correctAnswers : 0,
          questionsAttempted: leaderboardEntry ? leaderboardEntry.questionsAttempted : 0
        },
        created_at: challenge.created_at,
        expires_at: challenge.expires_at,
        times_played: challenge.times_played
      }
    });
  } catch (error) {
    console.error("Challenge retrieval error:", error);
    res.status(500).json({ message: "Failed to retrieve challenge", error: error.message });
  }
});

/**
 * @route   GET /api/challenges/user/active
 * @desc    Get all active challenges created by a user
 * @access  Private
 */
router.get("/user/active", protect, async (req, res) => {
  try {
    const challenges = await Challenge.find({ 
      challenger: req.user._id,
      expires_at: { $gt: new Date() }
    }).sort({ created_at: -1 });
    
    res.json({
      success: true,
      count: challenges.length,
      challenges: challenges.map(c => ({
        challenge_id: c.challenge_id,
        created_at: c.created_at,
        expires_at: c.expires_at,
        times_played: c.times_played
      }))
    });
  } catch (error) {
    console.error("User challenges retrieval error:", error);
    res.status(500).json({ message: "Failed to retrieve user challenges", error: error.message });
  }
});

module.exports = router;