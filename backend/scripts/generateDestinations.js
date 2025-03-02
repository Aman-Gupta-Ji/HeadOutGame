// ./backend/scripts/generateDestinations.js
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const env = require('../config/env');

// OpenAI configuration
const openai = new OpenAI({
  apiKey: env.openaiApiKey,
});

// Load starter dataset
const starterDataPath = path.join(__dirname, '../../data/starter_destinations.json');
const outputPath = path.join(__dirname, '../../data/destinations.json');

// Configuration
const MAX_RETRIES = 3;
const MODELS = ['gpt-3.5-turbo']; // Changed from gpt-4 to gpt-3.5-turbo

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
async function generateDestinationsBatch(batchSize, existingCountries, continent = null, retryCount = 0) {
  // Check if we've exceeded max retries
  if (retryCount >= MAX_RETRIES) {
    console.error(`Maximum retry count (${MAX_RETRIES}) exceeded. Skipping this batch.`);
    return [];
  }

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
${existingCountries.size > 0 ? `Avoid these countries as they're already covered: ${Array.from(existingCountries).join(', ')}.` : ''}
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

Return ONLY a valid JSON array containing ${batchSize} destinations with no additional text.`;

    // Use the current model based on availability
    const model = MODELS[0];
    console.log(`Using model: ${model}`);

    const response = await openai.chat.completions.create({
      model: model,
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

    const content = response.choices[0].message.content;
    
    // Extract the JSON array from the response
    const jsonStartIndex = content.indexOf('[');
    const jsonEndIndex = content.lastIndexOf(']') + 1;
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      console.error("Could not find valid JSON array in response");
      console.log("Raw response:", content);
      // Retry with the same parameters
      return generateDestinationsBatch(batchSize, existingCountries, continent, retryCount + 1);
    }
    
    const jsonContent = content.substring(jsonStartIndex, jsonEndIndex);
    
    try {
      const destinations = JSON.parse(jsonContent);
      console.log(`Successfully generated ${destinations.length} destinations`);
      return destinations;
    } catch (error) {
      console.error("Failed to parse generated JSON:", error);
      console.log("Raw JSON content:", jsonContent);
      // Retry with the same parameters
      return generateDestinationsBatch(batchSize, existingCountries, continent, retryCount + 1);
    }
  } catch (error) {
    console.error(`OpenAI API error (Attempt ${retryCount + 1}/${MAX_RETRIES}):`, error.message);
    
    // Add a longer delay between retries
    console.log(`Waiting 5 seconds before retry ${retryCount + 1}...`);
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Retry with the same parameters
    return generateDestinationsBatch(batchSize, existingCountries, continent, retryCount + 1);
  }
}

/**
 * Main function to generate the complete dataset
 */
async function generateDataset() {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log(`Created data directory at ${dataDir}`);
    }

    // Load starter data or create with sample data if it doesn't exist
    let starterData = [];
    try {
      if (fs.existsSync(starterDataPath)) {
        starterData = JSON.parse(fs.readFileSync(starterDataPath, 'utf8'));
        console.log(`Starting with ${starterData.length} destinations from starter dataset`);
      } else {
        // Create starter dataset with the 3 examples from the assessment
        starterData = [
          {
            "city": "Paris",
            "country": "France",
            "clues": [
              "This city is home to a famous tower that sparkles every night.",
              "Known as the 'City of Love' and a hub for fashion and art."
            ],
            "fun_fact": [
              "The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!",
              "Paris has only one stop sign in the entire city—most intersections rely on priority-to-the-right rules."
            ],
            "trivia": [
              "This city is famous for its croissants and macarons. Bon appétit!",
              "Paris was originally a Roman city called Lutetia."
            ],
            "continent": "Europe"
          },
          {
            "city": "Tokyo",
            "country": "Japan",
            "clues": [
              "This city has the busiest pedestrian crossing in the world.",
              "You can visit an entire district dedicated to anime, manga, and gaming."
            ],
            "fun_fact": [
              "Tokyo was originally a small fishing village called Edo before becoming the bustling capital it is today!",
              "More than 14 million people live in Tokyo, making it one of the most populous cities in the world."
            ],
            "trivia": [
              "The city has over 160,000 restaurants, more than any other city in the world.",
              "Tokyo's subway system is so efficient that train delays of just a few minutes come with formal apologies."
            ],
            "continent": "Asia"
          },
          {
            "city": "New York",
            "country": "USA",
            "clues": [
              "Home to a green statue gifted by France in the 1800s.",
              "Nicknamed 'The Big Apple' and known for its Broadway theaters."
            ],
            "fun_fact": [
              "The Statue of Liberty was originally a copper color before oxidizing to its iconic green patina.",
              "Times Square was once called Longacre Square before being renamed in 1904."
            ],
            "trivia": [
              "New York City has 468 subway stations, making it one of the most complex transit systems in the world.",
              "The Empire State Building has its own zip code: 10118."
            ],
            "continent": "North America"
          }
        ];
        
        fs.writeFileSync(starterDataPath, JSON.stringify(starterData, null, 2));
        console.log(`Created starter dataset with 3 example destinations`);
      }
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
    
    // Count existing destinations by assumed continent
    for (const dest of destinations) {
      if (dest.continent) {
        continentCounts[dest.continent] = (continentCounts[dest.continent] || 0) + 1;
      } else {
        const continent = mapCountryToContinent(dest.country);
        if (continent) {
          continentCounts[continent]++;
        }
      }
    }
    
    // Generate batches until we reach the target count
    let retryCounter = 0;
    const MAX_TOTAL_RETRIES = 10;
    
    while (destinations.length < targetCount && retryCounter < MAX_TOTAL_RETRIES) {
      // Determine which continent to focus on next
      let targetContinent = null;
      const continentsNeedingMore = Object.entries(continentTargets)
        .filter(([continent, target]) => continentCounts[continent] < target)
        .sort(([, a], [, b]) => (continentCounts[a] || 0) - (continentCounts[b] || 0));
      
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
        console.log("Generation failed, trying again with a different approach...");
        retryCounter++;
        
        if (retryCounter >= MAX_TOTAL_RETRIES) {
          console.error(`Maximum total retry count (${MAX_TOTAL_RETRIES}) exceeded. Stopping generation.`);
          break;
        }
        
        // Wait longer between major retries
        await new Promise(resolve => setTimeout(resolve, 10000));
        continue;
      }
      
      // Reset retry counter on success
      retryCounter = 0;
      
      // Add to main dataset
      for (const dest of newBatch) {
        // Assign continent if not present
        if (!dest.continent) {
          const continent = mapCountryToContinent(dest.country);
          dest.continent = continent || "Other";
        }
        
        // Update continent counts
        if (continentCounts[dest.continent]) {
          continentCounts[dest.continent]++;
        } else {
          continentCounts[dest.continent] = 1;
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
      
      // Respect API rate limits
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