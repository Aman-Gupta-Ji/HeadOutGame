import openai
import json
import time
import random

# Configuration
openai_api_key = "YOUR_API_KEY"
client = openai.OpenAI(api_key=openai_api_key)
existing_data_path = "starter_destinations.json"
output_path = "full_destinations.json"
batch_size = 10
target_destinations = 100

# Load starter dataset
with open(existing_data_path, "r") as file:
    destinations = json.load(file)

print(f"Starting with {len(destinations)} destinations from starter dataset")

# Track countries to ensure global diversity
existing_countries = set([d["country"] for d in destinations])

# Define continent distribution targets
continent_targets = {
    "Africa": 15,
    "Asia": 25,
    "Europe": 25,
    "North America": 15,
    "South America": 10,
    "Oceania": 10
}

# Generation function with geographic diversity enforcement
def generate_destinations_batch(batch_size, existing_countries, target_continent=None):
    prompt_text = f"""Generate {batch_size} unique travel destinations as JSON objects.

Each destination must include:
- City name (or specific location name)
- Country
- 2-3 cryptic clues that hint at the destination without naming it directly
- 2-3 interesting fun facts about the destination
- 2-3 trivia items about the destination

{f'Focus on destinations in {target_continent}.' if target_continent else ''}
Avoid these countries as they're already covered: {', '.join(sorted(existing_countries))}.
Ensure clues are appropriately cryptic but solvable.

Format each destination exactly like this example:
{{
  "city": "Cairo",
  "country": "Egypt",
  "clues": [
    "This ancient city sits near a geometric wonder built by early mathematicians.",
    "The world's longest river flows through this city before splitting into a delta."
  ],
  "fun_fact": [
    "This city is home to one of the only remaining Seven Wonders of the Ancient World.",
    "Despite being in a desert country, this city experiences occasional light snow."
  ],
  "trivia": [
    "This city's name in Arabic means 'The Victorious'.",
    "It is home to the world's oldest university, Al-Azhar, established in 970 CE."
  ]
}}

Return a valid JSON array containing {batch_size} destinations.
"""

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a travel expert specializing in creating engaging travel content for a game."},
            {"role": "user", "content": prompt_text}
        ],
        temperature=0.7
    )
    
    content = response.choices[0].message.content
    
    # Clean and parse the response
    try:
        # Find JSON array in the response
        json_start = content.find('[')
        json_end = content.rfind(']') + 1
        if json_start >= 0 and json_end > 0:
            json_content = content[json_start:json_end]
            new_destinations = json.loads(json_content)
            return new_destinations
        else:
            print("Could not find JSON array in response")
            return []
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {str(e)}")
        print(f"Raw content: {content}")
        return []

# Main generation loop with continent targeting
while len(destinations) < target_destinations:
    # Determine which continent to target next
    remaining_continents = {c: t for c, t in continent_targets.items() 
                           if sum(1 for d in destinations if continent_lookup(d["country"]) == c) < t}
    
    if not remaining_continents:
        target_continent = None  # No specific continent targeting if all targets met
    else:
        target_continent = random.choice(list(remaining_continents.keys()))
    
    print(f"Generating batch targeting: {target_continent or 'No specific continent'}")
    
    new_batch = generate_destinations_batch(
        min(batch_size, target_destinations - len(destinations)),
        existing_countries,
        target_continent
    )
    
    if new_batch:
        # Add to destination list and update tracking sets
        destinations.extend(new_batch)
        for dest in new_batch:
            existing_countries.add(dest["country"])
        
        # Save intermediate results
        with open(output_path, "w") as file:
            json.dump(destinations, f, indent=2)
            
        print(f"Progress: {len(destinations)}/{target_destinations} destinations")
    
    # Respect API rate limits
    time.sleep(3)

print(f"Dataset generation complete. Total: {len(destinations)} destinations.")