const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;