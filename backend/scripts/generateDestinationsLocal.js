const fs = require('fs');
const path = require('path');

// Load starter dataset
const starterDataPath = path.join(__dirname, '../../data/starter_destinations.json');
const outputPath = path.join(__dirname, '../../data/destinations.json');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`Created data directory at ${dataDir}`);
}

// City data sources
const worldCities = [
  // Africa (15)
  { city: "Cairo", country: "Egypt", continent: "Africa", landmarks: ["Pyramids", "Sphinx", "Nile River"], keywords: ["ancient", "pharaohs", "desert"] },
  { city: "Cape Town", country: "South Africa", continent: "Africa", landmarks: ["Table Mountain", "Robben Island", "Cape of Good Hope"], keywords: ["coastline", "wildlife", "vineyards"] },
  { city: "Marrakech", country: "Morocco", continent: "Africa", landmarks: ["Medina", "Jemaa el-Fnaa", "Bahia Palace"], keywords: ["markets", "spices", "desert"] },
  { city: "Nairobi", country: "Kenya", continent: "Africa", landmarks: ["Nairobi National Park", "Giraffe Centre", "Karen Blixen Museum"], keywords: ["safari", "wildlife", "metropolis"] },
  { city: "Lagos", country: "Nigeria", continent: "Africa", landmarks: ["Lekki Conservation Centre", "Nike Art Gallery", "National Museum"], keywords: ["megacity", "music", "beaches"] },
  { city: "Addis Ababa", country: "Ethiopia", continent: "Africa", landmarks: ["National Museum", "Holy Trinity Cathedral", "Entoto Hill"], keywords: ["highlands", "coffee", "ancient"] },
  { city: "Johannesburg", country: "South Africa", continent: "Africa", landmarks: ["Apartheid Museum", "Constitution Hill", "Gold Reef City"], keywords: ["gold", "history", "urban"] },
  { city: "Casablanca", country: "Morocco", continent: "Africa", landmarks: ["Hassan II Mosque", "Old Medina", "Morocco Mall"], keywords: ["film", "architecture", "coastal"] },
  { city: "Tunis", country: "Tunisia", continent: "Africa", landmarks: ["Medina", "Carthage Ruins", "Bardo Museum"], keywords: ["ancient", "Mediterranean", "ruins"] },
  { city: "Luxor", country: "Egypt", continent: "Africa", landmarks: ["Valley of the Kings", "Karnak Temple", "Luxor Temple"], keywords: ["tombs", "pharaohs", "temples"] },
  { city: "Kigali", country: "Rwanda", continent: "Africa", landmarks: ["Genocide Memorial", "Inema Arts Center", "Kimironko Market"], keywords: ["hills", "recovery", "cleanliness"] },
  { city: "Zanzibar City", country: "Tanzania", continent: "Africa", landmarks: ["Stone Town", "Prison Island", "Spice Plantations"], keywords: ["spices", "beaches", "history"] },
  { city: "Dakar", country: "Senegal", continent: "Africa", landmarks: ["African Renaissance Monument", "Goree Island", "Pink Lake"], keywords: ["westernmost", "colonial", "music"] },
  { city: "Victoria Falls", country: "Zimbabwe", continent: "Africa", landmarks: ["Mosi-oa-Tunya", "Devil's Pool", "Victoria Falls Bridge"], keywords: ["waterfall", "natural wonder", "mist"] },
  { city: "Giza", country: "Egypt", continent: "Africa", landmarks: ["Great Pyramid", "Sphinx", "Solar Boat Museum"], keywords: ["ancient", "wonders", "desert"] },
  
  // Asia (20)
  { city: "Kyoto", country: "Japan", continent: "Asia", landmarks: ["Fushimi Inari Shrine", "Kinkaku-ji", "Arashiyama Bamboo Grove"], keywords: ["ancient", "temples", "geisha"] },
  { city: "Bangkok", country: "Thailand", continent: "Asia", landmarks: ["Grand Palace", "Wat Arun", "Chatuchak Market"], keywords: ["temples", "street food", "canals"] },
  { city: "Singapore", country: "Singapore", continent: "Asia", landmarks: ["Marina Bay Sands", "Gardens by the Bay", "Sentosa Island"], keywords: ["modern", "clean", "multicultural"] },
  { city: "Beijing", country: "China", continent: "Asia", landmarks: ["Forbidden City", "Great Wall", "Temple of Heaven"], keywords: ["imperial", "ancient", "dynasty"] },
  { city: "Istanbul", country: "Turkey", continent: "Asia", landmarks: ["Hagia Sophia", "Blue Mosque", "Grand Bazaar"], keywords: ["two continents", "Byzantine", "Ottoman"] },
  { city: "Dubai", country: "United Arab Emirates", continent: "Asia", landmarks: ["Burj Khalifa", "Palm Jumeirah", "Dubai Mall"], keywords: ["tallest", "luxury", "desert"] },
  { city: "Hong Kong", country: "China", continent: "Asia", landmarks: ["Victoria Peak", "Tian Tan Buddha", "Star Ferry"], keywords: ["skyline", "harbor", "islands"] },
  { city: "Seoul", country: "South Korea", continent: "Asia", landmarks: ["Gyeongbokgung Palace", "N Seoul Tower", "Bukchon Hanok Village"], keywords: ["technology", "palaces", "kimchi"] },
  { city: "Jaipur", country: "India", continent: "Asia", landmarks: ["Hawa Mahal", "Amber Fort", "City Palace"], keywords: ["pink city", "forts", "maharajas"] },
  { city: "Hanoi", country: "Vietnam", continent: "Asia", landmarks: ["Hoan Kiem Lake", "Temple of Literature", "Old Quarter"], keywords: ["ancient", "street food", "colonial"] },
  { city: "Jerusalem", country: "Israel", continent: "Asia", landmarks: ["Western Wall", "Dome of the Rock", "Church of the Holy Sepulchre"], keywords: ["holy", "ancient", "religions"] },
  { city: "Bali", country: "Indonesia", continent: "Asia", landmarks: ["Uluwatu Temple", "Tegallalang Rice Terraces", "Sacred Monkey Forest"], keywords: ["paradise", "temples", "beaches"] },
  { city: "Shanghai", country: "China", continent: "Asia", landmarks: ["The Bund", "Oriental Pearl Tower", "Yu Garden"], keywords: ["finance", "skyline", "colonial"] },
  { city: "Varanasi", country: "India", continent: "Asia", landmarks: ["Ganges River", "Kashi Vishwanath Temple", "Sarnath"], keywords: ["spiritual", "ancient", "holy"] },
  { city: "Petra", country: "Jordan", continent: "Asia", landmarks: ["Treasury", "Monastery", "Siq"], keywords: ["rose city", "Nabataean", "carved"] },
  { city: "Chiang Mai", country: "Thailand", continent: "Asia", landmarks: ["Doi Suthep", "Old City Temples", "Elephant Nature Park"], keywords: ["mountains", "temples", "artisans"] },
  { city: "Kathmandu", country: "Nepal", continent: "Asia", landmarks: ["Swayambhunath", "Boudhanath", "Durbar Square"], keywords: ["mountains", "temples", "Everest"] },
  { city: "Luang Prabang", country: "Laos", continent: "Asia", landmarks: ["Kuang Si Falls", "Royal Palace", "Mount Phousi"], keywords: ["monks", "French", "Buddhist"] },
  { city: "Angkor", country: "Cambodia", continent: "Asia", landmarks: ["Angkor Wat", "Ta Prohm", "Bayon Temple"], keywords: ["temples", "jungle", "ancient"] },
  { city: "Samarkand", country: "Uzbekistan", continent: "Asia", landmarks: ["Registan", "Bibi-Khanym Mosque", "Shah-i-Zinda"], keywords: ["silk road", "turquoise", "ancient"] },
  
  // Europe (25)
  { city: "Rome", country: "Italy", continent: "Europe", landmarks: ["Colosseum", "Vatican", "Trevi Fountain"], keywords: ["ancient", "empire", "pasta"] },
  { city: "Venice", country: "Italy", continent: "Europe", landmarks: ["Grand Canal", "St. Mark's Square", "Rialto Bridge"], keywords: ["canals", "gondolas", "masks"] },
  { city: "Barcelona", country: "Spain", continent: "Europe", landmarks: ["Sagrada Familia", "Park Güell", "La Rambla"], keywords: ["Gaudi", "modernism", "beach"] },
  { city: "Amsterdam", country: "Netherlands", continent: "Europe", landmarks: ["Canals", "Anne Frank House", "Van Gogh Museum"], keywords: ["bicycles", "tulips", "windmills"] },
  { city: "Prague", country: "Czech Republic", continent: "Europe", landmarks: ["Charles Bridge", "Prague Castle", "Old Town Square"], keywords: ["medieval", "beer", "astronomical clock"] },
  { city: "Santorini", country: "Greece", continent: "Europe", landmarks: ["Blue Domes", "Caldera", "Red Beach"], keywords: ["white", "volcanic", "sunsets"] },
  { city: "London", country: "United Kingdom", continent: "Europe", landmarks: ["Big Ben", "Tower Bridge", "Buckingham Palace"], keywords: ["royal", "underground", "fog"] },
  { city: "Budapest", country: "Hungary", continent: "Europe", landmarks: ["Parliament", "Fisherman's Bastion", "Thermal Baths"], keywords: ["Danube", "thermal", "empire"] },
  { city: "Vienna", country: "Austria", continent: "Europe", landmarks: ["Schönbrunn Palace", "St. Stephen's Cathedral", "Vienna State Opera"], keywords: ["music", "imperial", "coffee"] },
  { city: "St. Petersburg", country: "Russia", continent: "Europe", landmarks: ["Hermitage Museum", "Church of the Savior on Blood", "Peter and Paul Fortress"], keywords: ["imperial", "canals", "czars"] },
  { city: "Athens", country: "Greece", continent: "Europe", landmarks: ["Acropolis", "Parthenon", "Ancient Agora"], keywords: ["democracy", "ancient", "philosophy"] },
  { city: "Edinburgh", country: "United Kingdom", continent: "Europe", landmarks: ["Edinburgh Castle", "Royal Mile", "Arthur's Seat"], keywords: ["Scotland", "medieval", "festivals"] },
  { city: "Dublin", country: "Ireland", continent: "Europe", landmarks: ["Trinity College", "Guinness Storehouse", "Temple Bar"], keywords: ["literary", "pubs", "music"] },
  { city: "Dubrovnik", country: "Croatia", continent: "Europe", landmarks: ["City Walls", "Old Town", "Lovrijenac Fortress"], keywords: ["Adriatic", "walled", "coastal"] },
  { city: "Florence", country: "Italy", continent: "Europe", landmarks: ["Duomo", "Uffizi Gallery", "Ponte Vecchio"], keywords: ["Renaissance", "art", "Medici"] },
  { city: "Reykjavik", country: "Iceland", continent: "Europe", landmarks: ["Hallgrimskirkja", "Blue Lagoon", "Harpa Concert Hall"], keywords: ["northern lights", "geothermal", "midnight sun"] },
  { city: "Stockholm", country: "Sweden", continent: "Europe", landmarks: ["Gamla Stan", "Vasa Museum", "Royal Palace"], keywords: ["archipelago", "islands", "Nordic"] },
  { city: "Lisbon", country: "Portugal", continent: "Europe", landmarks: ["Belém Tower", "Jerónimos Monastery", "Alfama District"], keywords: ["hills", "tiles", "explorers"] },
  { city: "Berlin", country: "Germany", continent: "Europe", landmarks: ["Brandenburg Gate", "Berlin Wall", "Reichstag"], keywords: ["history", "divided", "rebirth"] },
  { city: "Brussels", country: "Belgium", continent: "Europe", landmarks: ["Grand Place", "Atomium", "Manneken Pis"], keywords: ["chocolate", "waffles", "beer"] },
  { city: "Copenhagen", country: "Denmark", continent: "Europe", landmarks: ["Nyhavn", "Little Mermaid", "Tivoli Gardens"], keywords: ["Scandinavian", "bicycles", "hygge"] },
  { city: "Istanbul", country: "Turkey", continent: "Europe", landmarks: ["Hagia Sophia", "Blue Mosque", "Bosphorus"], keywords: ["two continents", "Byzantine", "Ottoman"] },
  { city: "Madrid", country: "Spain", continent: "Europe", landmarks: ["Prado Museum", "Plaza Mayor", "Royal Palace"], keywords: ["tapas", "art", "capital"] },
  { city: "Munich", country: "Germany", continent: "Europe", landmarks: ["Marienplatz", "Nymphenburg Palace", "English Garden"], keywords: ["Oktoberfest", "beer", "Bavarian"] },
  { city: "Zurich", country: "Switzerland", continent: "Europe", landmarks: ["Lake Zurich", "Bahnhofstrasse", "Grossmünster"], keywords: ["alpine", "banking", "chocolate"] },
  
  // North America (15)
  { city: "San Francisco", country: "USA", continent: "North America", landmarks: ["Golden Gate Bridge", "Alcatraz", "Cable Cars"], keywords: ["hills", "tech", "bay"] },
  { city: "Mexico City", country: "Mexico", continent: "North America", landmarks: ["Zocalo", "Frida Kahlo Museum", "Teotihuacan"], keywords: ["ancient", "Aztec", "metropolis"] },
  { city: "Havana", country: "Cuba", continent: "North America", landmarks: ["Old Havana", "Malecon", "Plaza de la Catedral"], keywords: ["vintage cars", "music", "colonial"] },
  { city: "Vancouver", country: "Canada", continent: "North America", landmarks: ["Stanley Park", "Granville Island", "Capilano Bridge"], keywords: ["mountains", "ocean", "outdoors"] },
  { city: "New Orleans", country: "USA", continent: "North America", landmarks: ["French Quarter", "Bourbon Street", "Garden District"], keywords: ["jazz", "Mardi Gras", "Creole"] },
  { city: "Las Vegas", country: "USA", continent: "North America", landmarks: ["The Strip", "Bellagio Fountains", "Fremont Street"], keywords: ["casinos", "entertainment", "desert"] },
  { city: "Toronto", country: "Canada", continent: "North America", landmarks: ["CN Tower", "Royal Ontario Museum", "Distillery District"], keywords: ["multicultural", "lakes", "maple"] },
  { city: "Chicago", country: "USA", continent: "North America", landmarks: ["Willis Tower", "Millennium Park", "Navy Pier"], keywords: ["windy", "architecture", "deep dish"] },
  { city: "Cancun", country: "Mexico", continent: "North America", landmarks: ["Beaches", "Chichen Itza", "Underwater Museum"], keywords: ["resorts", "Mayan", "Caribbean"] },
  { city: "Quebec City", country: "Canada", continent: "North America", landmarks: ["Old Quebec", "Chateau Frontenac", "Montmorency Falls"], keywords: ["French", "walled", "historic"] },
  { city: "Oaxaca", country: "Mexico", continent: "North America", landmarks: ["Monte Alban", "Santo Domingo Church", "Hierve el Agua"], keywords: ["indigenous", "cuisine", "crafts"] },
  { city: "Washington D.C.", country: "USA", continent: "North America", landmarks: ["White House", "Lincoln Memorial", "Smithsonian"], keywords: ["capital", "monuments", "politics"] },
  { city: "Banff", country: "Canada", continent: "North America", landmarks: ["Lake Louise", "Moraine Lake", "Banff National Park"], keywords: ["Rockies", "wilderness", "turquoise"] },
  { city: "Antigua Guatemala", country: "Guatemala", continent: "North America", landmarks: ["Volcan de Agua", "Santa Catalina Arch", "Central Plaza"], keywords: ["colonial", "volcanoes", "cobblestone"] },
  { city: "Los Angeles", country: "USA", continent: "North America", landmarks: ["Hollywood Sign", "Venice Beach", "Griffith Observatory"], keywords: ["movies", "palm trees", "celebrities"] },
  
  // South America (10)
  { city: "Rio de Janeiro", country: "Brazil", continent: "South America", landmarks: ["Christ the Redeemer", "Copacabana Beach", "Sugarloaf Mountain"], keywords: ["carnival", "samba", "beaches"] },
  { city: "Buenos Aires", country: "Argentina", continent: "South America", landmarks: ["Casa Rosada", "La Boca", "Recoleta Cemetery"], keywords: ["tango", "steak", "European"] },
  { city: "Machu Picchu", country: "Peru", continent: "South America", landmarks: ["Incan Citadel", "Huayna Picchu", "Sun Gate"], keywords: ["Inca", "mountains", "ancient"] },
  { city: "Cusco", country: "Peru", continent: "South America", landmarks: ["Plaza de Armas", "Sacsayhuaman", "San Pedro Market"], keywords: ["Inca", "colonial", "altitude"] },
  { city: "Cartagena", country: "Colombia", continent: "South America", landmarks: ["Walled City", "Castillo San Felipe", "Getsemani"], keywords: ["colonial", "Caribbean", "colorful"] },
  { city: "La Paz", country: "Bolivia", continent: "South America", landmarks: ["Valle de la Luna", "Witches' Market", "Mi Teleférico"], keywords: ["altitude", "Andes", "markets"] },
  { city: "Santiago", country: "Chile", continent: "South America", landmarks: ["Plaza de Armas", "San Cristobal Hill", "La Moneda Palace"], keywords: ["Andes", "wine", "modern"] },
  { city: "Quito", country: "Ecuador", continent: "South America", landmarks: ["Historic Center", "Mitad del Mundo", "TelefériQo"], keywords: ["equator", "altitude", "colonial"] },
  { city: "Galapagos Islands", country: "Ecuador", continent: "South America", landmarks: ["Tortoise Reserve", "Darwin Research Station", "Kicker Rock"], keywords: ["evolution", "wildlife", "volcanic"] },
  { city: "Iguazu Falls", country: "Argentina", continent: "South America", landmarks: ["Devil's Throat", "Iguazu National Park", "Helicopter Tours"], keywords: ["waterfall", "jungle", "natural wonder"] },
  
  // Oceania (15)
  { city: "Sydney", country: "Australia", continent: "Oceania", landmarks: ["Opera House", "Harbour Bridge", "Bondi Beach"], keywords: ["harbour", "beaches", "koalas"] },
  { city: "Auckland", country: "New Zealand", continent: "Oceania", landmarks: ["Sky Tower", "Harbour Bridge", "Rangitoto Island"], keywords: ["volcanoes", "sailing", "Maori"] },
  { city: "Melbourne", country: "Australia", continent: "Oceania", landmarks: ["Federation Square", "Great Ocean Road", "Royal Botanical Gardens"], keywords: ["coffee", "laneways", "culture"] },
  { city: "Queenstown", country: "New Zealand", continent: "Oceania", landmarks: ["Lake Wakatipu", "Remarkables", "Skyline Gondola"], keywords: ["adventure", "mountains", "bungee"] },
  { city: "Bora Bora", country: "French Polynesia", continent: "Oceania", landmarks: ["Mount Otemanu", "Lagoon", "Matira Beach"], keywords: ["overwater", "paradise", "blue"] },
  { city: "Fiji", country: "Fiji", continent: "Oceania", landmarks: ["Mamanuca Islands", "Sigatoka Sand Dunes", "Garden of the Sleeping Giant"], keywords: ["paradise", "friendly", "coral"] },
  { city: "Uluru", country: "Australia", continent: "Oceania", landmarks: ["Ayers Rock", "Kata Tjuta", "Cultural Centre"], keywords: ["sacred", "red", "outback"] },
  { city: "Rotorua", country: "New Zealand", continent: "Oceania", landmarks: ["Pohutu Geyser", "Redwoods", "Maori Villages"], keywords: ["geothermal", "Maori", "sulphur"] },
  { city: "Hobart", country: "Australia", continent: "Oceania", landmarks: ["MONA", "Mount Wellington", "Salamanca Market"], keywords: ["Tasmania", "wilderness", "art"] },
  { city: "Vanuatu", country: "Vanuatu", continent: "Oceania", landmarks: ["Mount Yasur", "Blue Holes", "Champagne Beach"], keywords: ["volcanic", "tribal", "untouched"] },
  { city: "Great Barrier Reef", country: "Australia", continent: "Oceania", landmarks: ["Coral Sea", "Heart Reef", "Whitehaven Beach"], keywords: ["coral", "marine", "world wonder"] },
  { city: "Moorea", country: "French Polynesia", continent: "Oceania", landmarks: ["Magic Mountain", "Belvedere Lookout", "Temae Beach"], keywords: ["volcanic", "tropical", "lagoon"] },
  { city: "Darwin", country: "Australia", continent: "Oceania", landmarks: ["Kakadu National Park", "Mindil Beach", "Jumping Crocodile Cruises"], keywords: ["tropical", "crocodiles", "outback"] },
  { city: "Christchurch", country: "New Zealand", continent: "Oceania", landmarks: ["Cardboard Cathedral", "Botanic Gardens", "Avon River"], keywords: ["garden city", "rebuild", "English"] },
  { city: "Tonga", country: "Tonga", continent: "Oceania", landmarks: ["Royal Palace", "Ha'amonga 'a Maui", "Mapu'a 'a Vaea Blowholes"], keywords: ["kingdom", "whale watching", "Polynesian"] },
];

// Template generators for clues, fun facts, and trivia
const clueTemplates = [
  (city) => `This city is home to ${randomElement(city.landmarks)}, visited by millions each year.`,
  (city) => `Known for its ${randomElement(city.keywords)} culture and ${randomElement(city.keywords)} attractions.`,
  (city) => `Located in ${city.continent}, this destination offers views of ${randomElement(city.landmarks)}.`,
  (city) => `This ${randomElement(city.keywords)} city features the iconic ${randomElement(city.landmarks)}.`,
  (city) => `Visitors flock here to experience ${randomElement(city.landmarks)} and the local ${randomElement(city.keywords)} atmosphere.`,
  (city) => `This capital of ${city.country} boasts ${randomElement(city.landmarks)} among its attractions.`,
  (city) => `Famous for both ${randomElement(city.landmarks)} and its ${randomElement(city.keywords)} heritage.`,
  (city) => `In this ${city.continent}n destination, travelers can explore ${randomElement(city.landmarks)}.`,
  (city) => `This city's skyline features the remarkable ${randomElement(city.landmarks)}.`,
  (city) => `Known worldwide for its ${randomElement(city.keywords)} and the magnificent ${randomElement(city.landmarks)}.`
];

const funFactTemplates = [
  (city) => `${city.city} was originally built around ${randomElement(city.landmarks)}, which dates back hundreds of years.`,
  (city) => `The name "${city.city}" is derived from ancient words meaning "${randomElement(city.keywords)} ${randomElement(city.keywords)}".`,
  (city) => `${randomElement(city.landmarks)} was nearly destroyed during a major historical event but was saved by locals.`,
  (city) => `Unlike most cities in ${city.country}, ${city.city} has unique laws about ${randomElement(city.keywords)}.`,
  (city) => `The local cuisine features dishes that combine ${randomElement(city.keywords)} with ${randomElement(city.keywords)} flavors.`,
  (city) => `${city.city} experiences unusual weather patterns, including ${randomElement(city.keywords)} seasons.`,
  (city) => `Over 90% of the original ${randomElement(city.landmarks)} was constructed without modern technology.`,
  (city) => `${city.city} has sister cities in over 20 countries, with the oldest relationship dating back to the 1800s.`,
  (city) => `The city's population can double during the famous ${randomElement(city.keywords)} festival held annually.`,
  (city) => `${randomElement(city.landmarks)} was designed by a famous architect who never actually visited the city.`
];

const triviaTemplates = [
  (city) => `${city.city} is home to over 50 museums, with ${randomElement(city.landmarks)} being the most visited.`,
  (city) => `The traditional greeting in ${city.city} involves gestures related to ${randomElement(city.keywords)}.`,
  (city) => `The oldest building in ${city.city} dates back to a time when ${randomElement(city.keywords)} was the main industry.`,
  (city) => `Local legend claims that ${randomElement(city.landmarks)} was built by ancient visitors from another land.`,
  (city) => `${city.city} appears in over 100 films, most notably in scenes featuring ${randomElement(city.landmarks)}.`,
  (city) => `The city's public transportation system includes unique features inspired by ${randomElement(city.keywords)}.`,
  (city) => `Every year, ${city.city} hosts a competition related to ${randomElement(city.keywords)} that attracts global participants.`,
  (city) => `The water surrounding ${city.city} contains minerals that give it a distinctive ${randomElement(city.keywords)} quality.`,
  (city) => `Famous historical figures including notable ${randomElement(city.keywords)} experts have lived in ${city.city}.`,
  (city) => `${randomElement(city.landmarks)} contains hidden symbols related to ancient ${randomElement(city.keywords)} beliefs.`
];

// Helper function to get a random array element
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get random elements without duplicates
function getRandomUniqueElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Function to generate a destination
function generateDestination(cityData) {
  // Get 2-3 random unique clues
  const clueCount = Math.random() > 0.5 ? 3 : 2;
  const selectedClueTemplates = getRandomUniqueElements(clueTemplates, clueCount);
  const clues = selectedClueTemplates.map(template => template(cityData));
  
  // Get 2-3 random unique fun facts
  const factCount = Math.random() > 0.5 ? 3 : 2;
  const selectedFactTemplates = getRandomUniqueElements(funFactTemplates, factCount);
  const funFacts = selectedFactTemplates.map(template => template(cityData));
  
  // Get 2-3 random unique trivia items
  const triviaCount = Math.random() > 0.5 ? 3 : 2;
  const selectedTriviaTemplates = getRandomUniqueElements(triviaTemplates, triviaCount);
  const triviaItems = selectedTriviaTemplates.map(template => template(cityData));
  
  // Determine difficulty based on city popularity
  let difficulty = "medium";
  const majorCities = ["Paris", "Tokyo", "New York", "London", "Rome", "Sydney", "Bangkok", "Dubai"];
  if (majorCities.includes(cityData.city)) {
    difficulty = "easy";
  } else if (cityData.city.includes(" ") || cityData.landmarks.some(l => l.includes("Ancient") || l.includes("National"))) {
    difficulty = "hard";
  }
  
  // Return the formatted destination
  return {
    city: cityData.city,
    country: cityData.country,
    continent: cityData.continent,
    clues: clues,
    fun_fact: funFacts,
    trivia: triviaItems,
    difficulty: difficulty
  };
}

/**
 * Generate the complete dataset
 */
function generateDataset() {
  try {
    // Load starter data or create with sample data
    let destinations = [];
    try {
      if (fs.existsSync(starterDataPath)) {
        destinations = JSON.parse(fs.readFileSync(starterDataPath, 'utf8'));
        console.log(`Starting with ${destinations.length} destinations from starter dataset`);
      } else {
        // Create starter dataset with the 3 examples from the assessment
        destinations = [
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
            "continent": "Europe",
            "difficulty": "easy"
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
            "continent": "Asia",
            "difficulty": "easy"
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
            "continent": "North America",
            "difficulty": "easy"
          }
        ];
        
        fs.writeFileSync(starterDataPath, JSON.stringify(destinations, null, 2));
        console.log(`Created starter dataset with 3 example destinations`);
      }
    } catch (error) {
      console.warn(`Could not load starter data: ${error.message}`);
      console.log("Starting with an empty dataset");
      destinations = [];
    }
    
    // Track existing city names to avoid duplicates
    const existingCities = new Set(destinations.map(d => d.city));
    
    // Target destination count
    const targetCount = 100;
    
    // Track continental distribution
    const continentCounts = {
      'Africa': 0,
      'Asia': 0, 
      'Europe': 0,
      'North America': 0,
      'South America': 0,
      'Oceania': 0
    };
    
    // Count existing destinations by continent
    for (const dest of destinations) {
      if (dest.continent && continentCounts[dest.continent] !== undefined) {
        continentCounts[dest.continent]++;
      }
    }
    
    console.log("Initial continental distribution:");
    console.log(continentCounts);
    
    // Filter out cities that are already in the destinations array
    const availableCities = worldCities.filter(city => !existingCities.has(city.city));
    
    // Group available cities by continent
    const citiesByContinent = {};
    for (const city of availableCities) {
      if (!citiesByContinent[city.continent]) {
        citiesByContinent[city.continent] = [];
      }
      citiesByContinent[city.continent].push(city);
    }
    
    // Generate destinations until we reach the target count
    while (destinations.length < targetCount) {
      // Determine which continent to focus on next
      let targetContinent = null;
      const continentEntries = Object.entries(continentCounts);
      
      // Sort continents by how far they are from their target percentage
      const sortedContinents = continentEntries.sort((a, b) => {
        const aPercentage = a[1] / destinations.length || 0;
        const bPercentage = b[1] / destinations.length || 0;
        
        // Target percentages
        const targetPercentages = {
          'Africa': 0.15,
          'Asia': 0.20,
          'Europe': 0.25,
          'North America': 0.15,
          'South America': 0.10,
          'Oceania': 0.15
        };
        
        const aDiff = targetPercentages[a[0]] - aPercentage;
        const bDiff = targetPercentages[b[0]] - bPercentage;
        
        return bDiff - aDiff;
      });
      
      targetContinent = sortedContinents[0][0];
      
      // Check if we have available cities for this continent
      if (!citiesByContinent[targetContinent] || citiesByContinent[targetContinent].length === 0) {
        console.log(`No more available cities for ${targetContinent}. Choosing another continent.`);
        // Remove this continent from consideration
        delete citiesByContinent[targetContinent];
        
        // If we've exhausted all continents, break
        if (Object.keys(citiesByContinent).length === 0) {
          console.log("No more available cities in any continent. Stopping generation.");
          break;
        }
        
        // Choose another continent
        const availableContinents = Object.keys(citiesByContinent);
        targetContinent = availableContinents[0];
      }
      
      // Select a random city from the target continent
      const randomIndex = Math.floor(Math.random() * citiesByContinent[targetContinent].length);
      const selectedCity = citiesByContinent[targetContinent][randomIndex];
      
      // Remove the city from available cities
      citiesByContinent[targetContinent].splice(randomIndex, 1);
      
      // Generate a destination from the city data
      const newDestination = generateDestination(selectedCity);
      
      // Add to main dataset
      destinations.push(newDestination);
      
      // Update continent count
      continentCounts[newDestination.continent]++;
      
      // Print progress every 10 destinations
      if (destinations.length % 10 === 0) {
        console.log(`Progress: ${destinations.length}/${targetCount} destinations`);
        console.log("Continental distribution:");
        console.log(continentCounts);
      }
    }
    
    console.log("Dataset generation complete!");
    console.log(`Total destinations: ${destinations.length}`);
    console.log("Final continental distribution:");
    console.log(continentCounts);
    
    // Save final dataset
    fs.writeFileSync(outputPath, JSON.stringify(destinations, null, 2));
    console.log(`Saved dataset to ${outputPath}`);
    
    return destinations;
  } catch (error) {
    console.error("Error in generateDataset:", error);
    return [];
  }
}

// Run the generation if this file is executed directly
if (require.main === module) {
  console.log("Starting local destination data generation...");
  const result = generateDataset();
  console.log(`Generated ${result.length} destinations without using API calls`);
}

module.exports = { generateDataset };