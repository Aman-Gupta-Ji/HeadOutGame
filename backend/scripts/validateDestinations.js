const fs = require('fs');
const path = require('path');

// Path to data file
const dataPath = path.join(__dirname, '../../data/destinations.json');

/**
 * Validate the destinations dataset
 */
function validateDestinations() {
  console.log("Validating destinations dataset...");
  
  try {
    // Read data file
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`Found ${data.length} destinations to validate`);
    
    // Validation results
    const errors = [];
    const warnings = [];
    const stats = {
      total: data.length,
      duplicateCities: 0,
      missingFields: 0,
      shortClues: 0,
      shortFacts: 0,
      shortTrivia: 0
    };
    
    // Track cities and countries for duplicates
    const cityCountryPairs = new Set();
    
    // Validate each destination
    data.forEach((dest, index) => {
      // Check for required fields
      const requiredFields = ['city', 'country', 'clues', 'fun_fact', 'trivia'];
      const missingFields = requiredFields.filter(field => !dest[field]);
      
      if (missingFields.length > 0) {
        errors.push(`Destination ${index} (${dest.city || 'unnamed'}) is missing fields: ${missingFields.join(', ')}`);
        stats.missingFields++;
      }
      
      // Check for duplicate city/country combinations
      const cityCountryPair = `${dest.city},${dest.country}`.toLowerCase();
      if (cityCountryPairs.has(cityCountryPair)) {
        errors.push(`Duplicate city/country pair: ${dest.city}, ${dest.country}`);
        stats.duplicateCities++;
      } else {
        cityCountryPairs.add(cityCountryPair);
      }
      
      // Check array lengths
      if (dest.clues && dest.clues.length < 2) {
        warnings.push(`Destination ${dest.city}, ${dest.country} has fewer than 2 clues`);
        stats.shortClues++;
      }
      
      if (dest.fun_fact && dest.fun_fact.length < 2) {
        warnings.push(`Destination ${dest.city}, ${dest.country} has fewer than 2 fun facts`);
        stats.shortFacts++;
      }
      
      if (dest.trivia && dest.trivia.length < 2) {
        warnings.push(`Destination ${dest.city}, ${dest.country} has fewer than 2 trivia items`);
        stats.shortTrivia++;
      }
      
      // Check for clue quality (very basic check)
      if (dest.clues) {
        dest.clues.forEach((clue, i) => {
          if (clue.toLowerCase().includes(dest.city.toLowerCase())) {
            warnings.push(`Clue ${i+1} for ${dest.city} contains the city name`);
          }
        });
      }
    });
    
    // Print validation results
    console.log("\n=== Validation Results ===");
    console.log(`Total destinations: ${stats.total}`);
    console.log(`Errors found: ${errors.length}`);
    console.log(`Warnings found: ${warnings.length}`);
    
    console.log("\n=== Error Summary ===");
    console.log(`Missing required fields: ${stats.missingFields}`);
    console.log(`Duplicate city/country pairs: ${stats.duplicateCities}`);
    
    console.log("\n=== Warning Summary ===");
    console.log(`Destinations with fewer than 2 clues: ${stats.shortClues}`);
    console.log(`Destinations with fewer than 2 fun facts: ${stats.shortFacts}`);
    console.log(`Destinations with fewer than 2 trivia items: ${stats.shortTrivia}`);
    
    // Print detailed errors and warnings if any
    if (errors.length > 0) {
      console.log("\n=== Detailed Errors ===");
      errors.forEach((error, i) => console.log(`${i+1}. ${error}`));
    }
    
    if (warnings.length > 0) {
      console.log("\n=== Detailed Warnings ===");
      warnings.forEach((warning, i) => console.log(`${i+1}. ${warning}`));
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      stats
    };
  } catch (error) {
    console.error("Validation failed:", error);
    return {
      valid: false,
      errors: [`File read/parse error: ${error.message}`],
      warnings: [],
      stats: { total: 0 }
    };
  }
}

// Run validation if this file is executed directly
if (require.main === module) {
  validateDestinations();
}

module.exports = { validateDestinations };