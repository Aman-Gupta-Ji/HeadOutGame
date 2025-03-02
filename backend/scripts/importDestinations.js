const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const config = require('config');
const Destination = require('../models/Destination');

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(config.get('mongoURI'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('MongoDB Connected...');
    return true;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

// Import destinations
const importDestinations = async () => {
  try {
    // Read the destination data file
    const filePath = path.join(__dirname, '../../data/destinations.json');
    const rawData = fs.readFileSync(filePath);
    const destinations = JSON.parse(rawData);
    
    console.log(`Found ${destinations.length} destinations to import`);
    
    // Connect to database
    await connectDB();
    
    // Clear existing destinations first
    console.log('Clearing existing destination data...');
    await Destination.deleteMany({});
    
    // Insert all destinations
    console.log('Importing destinations...');
    const importResult = await Destination.insertMany(destinations);
    
    console.log(`Successfully imported ${importResult.length} destinations`);
    console.log('Import complete!');
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Error importing data:', err);
    process.exit(1);
  }
};

// Run the import
importDestinations();