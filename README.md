# Simplified README.md for Current State

Here's a simplified README focused only on the current state of the project (data generation and MongoDB setup):

```markdown
# Globetrotter Challenge

A travel destination guessing game where users are presented with cryptic clues about famous places and must guess the location.

## 🌟 Current Progress

This repository contains the initial phase of the Globetrotter Challenge project, focusing on data generation and database setup. The core game functionality and frontend are upcoming features.

## 🛠️ Tech Stack (Current)

- **Database**: MongoDB
- **Data Generation**: Custom Node.js scripts with template-based generation
- **Tools**: Mongoose for MongoDB object modeling

## 📊 Data Generation System

The current implementation includes a comprehensive data generation system that:

- Creates 100+ travel destinations across all continents
- Generates cryptic clues, fun facts, and trivia for each destination
- Ensures diverse geographic representation
- Assigns appropriate difficulty levels (easy, medium, hard)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local installation or Atlas connection)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/globetrotter.git
   cd globetrotter
   ```

2. Install dependencies:
   ```
   npm install mongoose dotenv fs path
   ```

3. Create a `.env` file in the project root with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/globetrotter
   ```

### Data Generation Instructions

The repository includes several scripts for generating and managing destination data:

1. **Generate destination data**: Creates 100+ destinations with clues, facts, and trivia
   ```
   npm run generate-data-local
   ```

2. **Fix data issues**: Validates and corrects data quality issues
   ```
   npm run fix-data
   ```

3. **Validate the dataset**: Checks for errors and warnings in the data
   ```
   npm run validate-data
   ```

4. **Import to MongoDB**: Imports the validated data into MongoDB
   ```
   npm run import-data
   ```

5. **Complete data pipeline**: Runs all steps in sequence
   ```
   npm run setup-data
   ```

### Data Structure

Each destination in the dataset contains:

```json
{
  "city": "City Name",
  "country": "Country Name",
  "continent": "Continent",
  "clues": [
    "First cryptic clue about the destination.",
    "Second cryptic clue about the destination."
  ],
  "fun_fact": [
    "First fun fact about the destination.",
    "Second fun fact about the destination."
  ],
  "trivia": [
    "First trivia item about the destination.",
    "Second trivia item about the destination."
  ],
  "difficulty": "easy|medium|hard"
}
```

## 📁 Project Structure (Current)

```
globetrotter/
│
├── backend/                  # Backend code
│   ├── config/               # Configuration files
│   │   ├── db.js             # MongoDB connection
│   │   └── env.js            # Environment variables
│   │
│   ├── models/               # MongoDB schemas
│   │   └── Destination.js    # Destination model
│   │
│   └── scripts/              # Data scripts
│       ├── generateDestinationsLocal.js  # Data generation
│       ├── fixDestinationData.js         # Data correction
│       ├── validateDestinations.js       # Data validation
│       └── importToMongoDB.js            # Database import
│
├── data/                     # Generated data
│   ├── starter_destinations.json   # Initial example data
│   └── destinations.json           # Generated dataset
│
├── .env                      # Environment variables
└── package.json              # Project dependencies
```

## 🔮 Next Steps

- Implement Express.js server and API endpoints
- Create game mechanics and logic
- Develop frontend UI
- Add user management and social features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
```