const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  continent: {
    type: String,
    required: true,
    enum: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Antarctica']
  },
  clues: {
    type: [String],
    required: true,
    validate: [arrayMinLength, 'At least two clues are required']
  },
  fun_fact: {
    type: [String],
    required: true,
    validate: [arrayMinLength, 'At least two fun facts are required']
  },
  trivia: {
    type: [String],
    required: true,
    validate: [arrayMinLength, 'At least two trivia items are required']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  date_added: {
    type: Date,
    default: Date.now
  }
});

// Validator to ensure arrays have at least 2 items
function arrayMinLength(val) {
  return val.length >= 2;
}

// Create a compound index for efficient lookups
DestinationSchema.index({ city: 1, country: 1 }, { unique: true });

module.exports = mongoose.model('Destination', DestinationSchema);