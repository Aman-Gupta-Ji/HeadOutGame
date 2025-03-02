const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const env = require('../config/env');
const { validateDestinations } = require('./validateDestinations');

// Path to JSON data file
const dataPath = path.join(__dirname, '../../data/destinations.json');

// Import the Destination model
const Destination = require('../models/Destination');

/**
 * Connect to MongoDB
 */
async function connectToMongoDB() {
  try {
    await mongoose.connect(env.mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

/**
 * Import destinations to MongoDB
 */
async function importDestinations() {
  console.log('Starting destination import to MongoDB...');
  
  // Validate data before import
  const validationResult = validateDestinations();
  if (!validationResult.valid) {
    console.error('Validation failed! Fix errors before importing.');
    console.log(`Found ${validationResult.errors.length} errors.`);
    return false;
  }
  
  // Connect to MongoDB
  const connected = await connectToMongoDB();
  if (!connected) {
    console.error('MongoDB connection failed. Aborting import.');
    return false;
  }
  
  try {
    // Read the data file
    const destinations = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`Found ${destinations.length} destinations to import`);
    
    // Clear existing destinations (optional - comment out if you want to keep existing data)
    console.log('Clearing existing destinations...');
    await Destination.deleteMany({});
    
    // Add difficulty levels if not present
    const destinationsWithDifficulty = destinations.map(dest => {
      if (!dest.difficulty) {
        // Simple algorithm to assign difficulty:
        // - Major tourist cities: easy
        // - Less well-known cities: medium
        // - Obscure destinations: hard
        // This is just a placeholder - in a real app, you'd want a more sophisticated approach
        const majorCities = [
          'Paris', 'London', 'New York', 'Tokyo', 'Rome', 'Sydney', 'Beijing',
          'Cairo', 'Istanbul', 'Rio de Janeiro', 'Los Angeles', 'Berlin'
        ];
        
        if (majorCities.includes(dest.city)) {
          dest.difficulty = 'easy';
        } else {
          dest.difficulty = 'medium';
        }
      }
      
      // Make sure continent is set
      if (!dest.continent) {
        dest.continent = mapCountryToContinent(dest.country) || 'Other';
      }
      
      return dest;
    });
    
    // Import in batches to avoid overwhelming the database
    const batchSize = 20;
    let imported = 0;
    
    for (let i = 0; i < destinationsWithDifficulty.length; i += batchSize) {
      const batch = destinationsWithDifficulty.slice(i, i + batchSize);
      await Destination.insertMany(batch);
      imported += batch.length;
      console.log(`Imported ${imported}/${destinationsWithDifficulty.length} destinations`);
    }
    
    console.log('Import complete!');
    console.log(`Successfully imported ${imported} destinations to MongoDB`);
    
    // Close MongoDB connection
    await mongoose.connection.close();
    return true;
  } catch (error) {
    console.error('Import failed:', error);
    
    // Close MongoDB connection
    await mongoose.connection.close();
    return false;
  }
}

/**
 * Map a country to its continent (simplified mapping)
 * @param {string} country - Country name
 * @returns {string|null} - Continent name or null
 */
function mapCountryToContinent(country) {
  // This is a simplified mapping - in production you would use a more comprehensive dataset
  const continentMap = {
    // Africa
    'Egypt': 'Africa', 'Kenya': 'Africa', 'Morocco': 'Africa', 'South Africa': 'Africa',
    'Nigeria': 'Africa', 'Tanzania': 'Africa', 'Ethiopia': 'Africa',
    
    // Asia
    'Japan': 'Asia', 'China': 'Asia', 'India': 'Asia', 'Thailand': 'Asia', 
    'Vietnam': 'Asia', 'Singapore': 'Asia', 'Turkey': 'Asia', 'Indonesia': 'Asia',
    
    // Europe
    'France': 'Europe', 'Italy': 'Europe', 'Spain': 'Europe', 'Germany': 'Europe',
    'United Kingdom': 'Europe', 'Greece': 'Europe', 'Portugal': 'Europe',
    
    // North America
    'USA': 'North America', 'Canada': 'North America', 'Mexico': 'North America',
    'Cuba': 'North America', 'Jamaica': 'North America', 'Costa Rica': 'North America',
    
    // South America
    'Brazil': 'South America', 'Peru': 'South America', 'Argentina': 'South America',
    'Colombia': 'South America', 'Chile': 'South America',
    
    // Oceania
    'Australia': 'Oceania', 'New Zealand': 'Oceania', 'Fiji': 'Oceania'
  };
  
  return continentMap[country] || null;
}

// Run import if this file is executed directly
if (require.main === module) {
  importDestinations()
    .then(success => {
      if (success) {
        console.log('Import process completed successfully');
      } else {
        console.log('Import process completed with errors');
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('Unexpected error during import:', error);
      process.exit(1);
    });
}

module.exports = { importDestinations };