const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ChallengeSchema = new mongoose.Schema({
  challenge_id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  challenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  expires_at: {
    type: Date,
    default: function() {
      // Challenges expire after 7 days
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    }
  },
  times_played: {
    type: Number,
    default: 0
  }
});

// Create a TTL index that automatically deletes expired challenges
ChallengeSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Challenge', ChallengeSchema);