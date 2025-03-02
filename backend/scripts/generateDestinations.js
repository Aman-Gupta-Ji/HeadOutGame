// ./backend/scripts/generateDestinations.js
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai'); // Updated import syntax
const env = require('../config/env');

// OpenAI configuration - updated initialization
const openai = new OpenAI({
  apiKey: env.openaiApiKey,
});

// Load starter dataset
const starterDataPath = path.join(__dirname, '../../data/starter_destinations.json');
const outputPath = path.join(__dirname, '../../data/destinations.json');

// Tracking for geographic diversity
const continentTargets = {
  'Africa': 15,
  'Asia': 20,
  'Europe': 25,
  'North America': 15,
  'South America': 10,
  'Oceania': 15
};

/**
 * Generate a batch of destinations using OpenAI API
 * @param {number} batchSize - Number of destinations to generate
 * @param {Set} existingCountries - Set of countries to avoid
 * @param {string} continent - Target continent for this batch
 * @returns {Promise<Array>} Array of destination objects
 */
async function generateDestinationsBatch(batchSize, existingCountries, continent = null) {
  try {
    console.log(`Generating batch of ${batchSize} destinations${continent ? ` for ${continent}` : ''}...`);
    
    const prompt = `Generate ${batchSize} unique travel destinations as JSON objects.
Each destination must include:
- City name (or landmark name)
- Country
- 2-3 cryptic clues that hint at the destination without naming it directly
- 2-3 interesting fun facts about the destination
- 2-3 trivia items about the destination

${continent ? `Focus on destinations in ${continent}.` : ''}
Avoid these countries as they're already covered: ${Array.from(existingCountries).join(', ')}.
Ensure clues are appropriately cryptic but solvable.

Format each destination exactly like this example:
{
  "city": "Kyoto",
  "country": "Japan",
  "clues": [
    "This ancient city was once the imperial capital for over a thousand years.",
    "Famous for its 1,600 Buddhist temples and 400 Shinto shrines."
  ],
  "fun_fact": [
    "This city was removed from the atomic bomb target list during WWII due to its cultural significance.",
    "It's home to the oldest restaurant in Japan, operating continuously since 705 AD."
  ],
  "trivia": [
    "The name of this city translates to 'Capital City' in Japanese.",
    "Geisha culture still thrives in the historic district of this city."
  ]
}

Return a valid JSON array containing ${batchSize} destinations.`;

    // Updated API call format for v4
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a travel expert specializing in creating engaging travel content for a game."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    // Updated response structure
    const content = response.choices[0].message.content;
    
    // Extract the JSON array from the response
    const jsonStartIndex = content.indexOf('[');
    const jsonEndIndex = content.lastIndexOf(']') + 1;
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      console.error("Could not find valid JSON array in response");
      console.log("Raw response:", content);
      return [];
    }
    
    const jsonContent = content.substring(jsonStartIndex, jsonEndIndex);
    
    try {
      const destinations = JSON.parse(jsonContent);
      console.log(`Successfully generated ${destinations.length} destinations`);
      return destinations;
    } catch (error) {
      console.error("Failed to parse generated JSON:", error);
      console.log("Raw JSON content:", jsonContent);
      return [];
    }
  } catch (error) {
    console.error("OpenAI API error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    return [];
  }
}

/**
 * Main function to generate the complete dataset
 */
async function generateDataset() {
  try {
    // Load starter data
    let starterData = [];
    try {
      starterData = JSON.parse(fs.readFileSync(starterDataPath, 'utf8'));
      console.log(`Starting with ${starterData.length} destinations from starter dataset`);
    } catch (error) {
      console.warn(`Could not load starter data: ${error.message}`);
      console.log("Starting with an empty dataset");
      
      // Create the empty starter file
      fs.writeFileSync(starterDataPath, JSON.stringify([], null, 2));
    }
    
    // Track existing data
    let destinations = [...starterData];
    const existingCountries = new Set(destinations.map(d => d.country));
    
    // Set target destination count
    const targetCount = 100;
    const batchSize = 5; // Generate in small batches to monitor quality
    
    // Track continental distribution
    const continentCounts = {
      'Africa': 0,
      'Asia': 0, 
      'Europe': 0,
      'North America': 0,
      'South America': 0,
      'Oceania': 0
    };
    
    // Count existing destinations by assumed continent (simplified mapping)
    for (const dest of destinations) {
      const continent = mapCountryToContinent(dest.country);
      if (continent) {
        continentCounts[continent]++;
      }
    }
    
    // Generate batches until we reach the target count
    while (destinations.length < targetCount) {
      // Determine which continent to focus on next
      let targetContinent = null;
      const continentsNeedingMore = Object.entries(continentTargets)
        .filter(([continent, target]) => continentCounts[continent] < target)
        .sort(([, a], [, b]) => a - b);
      
      if (continentsNeedingMore.length > 0) {
        targetContinent = continentsNeedingMore[0][0];
      }
      
      // Generate a batch
      const newBatch = await generateDestinationsBatch(
        Math.min(batchSize, targetCount - destinations.length),
        existingCountries,
        targetContinent
      );
      
      if (newBatch.length === 0) {
        console.log("Generation failed, retrying...");
        continue;
      }
      
      // Add to main dataset
      for (const dest of newBatch) {
        // Assign continent
        const continent = mapCountryToContinent(dest.country);
        if (continent) {
          dest.continent = continent;
          continentCounts[continent]++;
        } else {
          dest.continent = "Other";
        }
        
        // Add to tracking
        destinations.push(dest);
        existingCountries.add(dest.country);
      }
      
      // Save intermediate results
      fs.writeFileSync(outputPath, JSON.stringify(destinations, null, 2));
      console.log(`Progress: ${destinations.length}/${targetCount} destinations`);
      
      // Log continental distribution
      console.log("Continental distribution:");
      Object.entries(continentCounts).forEach(([continent, count]) => {
        console.log(`${continent}: ${count}/${continentTargets[continent] || 'N/A'}`);
      });
      
      // Respect OpenAI rate limits
      console.log("Waiting before next batch...");
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    console.log("Dataset generation complete!");
    console.log(`Total destinations: ${destinations.length}`);
    
    // Final save
    fs.writeFileSync(outputPath, JSON.stringify(destinations, null, 2));
  } catch (error) {
    console.error("Error in generateDataset:", error);
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

// Run the data generation if this file is executed directly
if (require.main === module) {
  console.log("Starting destination data generation...");
  generateDataset()
    .then(() => console.log("Generation complete!"))
    .catch(err => console.error("Generation failed:", err));
}

module.exports = { generateDataset };