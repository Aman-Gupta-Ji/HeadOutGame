const fs = require('fs');
const path = require('path');

// Path to data file
const dataPath = path.join(__dirname, '../../data/destinations.json');

/**
 * Fix issues in the destinations dataset
 */
function fixDestinationData() {
  console.log("Fixing destination dataset issues...");
  
  try {
    // Read data file
    const destinations = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`Found ${destinations.length} destinations to process`);
    
    // Track cities and countries to identify duplicates
    const cityCountryMap = new Map();
    const fixedDestinations = [];
    let duplicatesFixed = 0;
    let cluesFixed = 0;
    
    // Process each destination
    destinations.forEach((dest) => {
      const key = `${dest.city},${dest.country}`.toLowerCase();
      
      // Handle duplicates - if already seen this city/country pair
      if (cityCountryMap.has(key)) {
        duplicatesFixed++;
        
        // For Istanbul specifically, change one to "Istanbul (European side)"
        if (dest.city === "Istanbul" && dest.country === "Turkey") {
          dest.city = "Istanbul (European side)";
          // Update the key after changing the city name
          const newKey = `${dest.city},${dest.country}`.toLowerCase();
          cityCountryMap.set(newKey, true);
          fixedDestinations.push(dest);
        }
        // For other duplicates, you could either skip them or modify them
        
      } else {
        // Not a duplicate, add to map and processed list
        cityCountryMap.set(key, true);
        
        // Fix clues that contain the city name
        if (dest.clues) {
          dest.clues = dest.clues.map(clue => {
            if (clue.toLowerCase().includes(dest.city.toLowerCase())) {
              cluesFixed++;
              // Replace the city name with "this city" or another generic reference
              return clue.replace(new RegExp(dest.city, 'gi'), "this city");
            }
            return clue;
          });
        }
        
        fixedDestinations.push(dest);
      }
    });
    
    console.log(`Fixed ${duplicatesFixed} duplicate city/country pairs`);
    console.log(`Fixed ${cluesFixed} clues containing city names`);
    console.log(`Final destination count: ${fixedDestinations.length}`);
    
    // Save the fixed data
    fs.writeFileSync(dataPath, JSON.stringify(fixedDestinations, null, 2));
    console.log("Fixed data saved successfully");
    
    return {
      success: true,
      duplicatesFixed,
      cluesFixed,
      finalCount: fixedDestinations.length
    };
  } catch (error) {
    console.error("Data fix failed:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the fixer if this file is executed directly
if (require.main === module) {
  const result = fixDestinationData();
  if (result.success) {
    console.log("Dataset fixed successfully!");
  } else {
    console.error("Failed to fix dataset:", result.error);
    process.exit(1);
  }
}

module.exports = { fixDestinationData };