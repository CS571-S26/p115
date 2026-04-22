/**
 * OpenAI API utilities for travel planning
 * Uses the OpenAI API key from environment variables
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

/**
 * Send a prompt to OpenAI and get a response
 * @param {string} prompt - The user's prompt
 * @param {string} model - The model to use (default: gpt-3.5-turbo)
 * @returns {Promise<string>} - The API response text
 */
export async function sendToOpenAI(prompt, model = 'gpt-3.5-turbo', temperature = 0.7) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file.')
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful travel planning assistant. You help users create detailed itineraries based on their preferences, budget, and travel dates.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: temperature,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to get response from OpenAI')
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw error
  }
}

/**
 * Create a travel planning prompt from form data
 * @param {object} formData - The travel plan form data
 * @returns {string} - A formatted prompt for OpenAI
 */
export function createTravelPlanPrompt(formData) {
  return `Please create a detailed travel itinerary based on the following information:

Destination: ${formData.destination}
${formData.destinationDetails ? `Additional destination details: ${formData.destinationDetails}` : ''}

Total Budget: ${formData.budget}
${formData.budgetDetails ? `Budget flexibility: ${formData.budgetDetails}` : ''}

Departure City: ${formData.departureCity}
${formData.departureCityDetails ? `Departure details: ${formData.departureCityDetails}` : ''}

Travel Dates: ${formData.travelDates}
${formData.travelDatesDetails ? `Date flexibility: ${formData.travelDatesDetails}` : ''}

Hotel Budget per Night: ${formData.budgetPerNight}
${formData.budgetPerNightDetails ? `Accommodation preferences: ${formData.budgetPerNightDetails}` : ''}

Travel Vibe & Activities: ${formData.vibe}

${formData.otherInfo ? `Additional Information: ${formData.otherInfo}` : ''}

Please provide:
1. A day-by-day itinerary
2. Estimated costs breakdown
3. Accommodation recommendations
4. Activity recommendations based on their interests
5. Travel tips and logistics`
}

/**
 * Create a flight search prompt from form data
 * @param {object} formData - The flight search form data
 * @returns {string} - A formatted prompt for OpenAI
 */
export function createFlightSearchPrompt(formData) {
  return `You are a flight search expert. Based on the following travel details, suggest the best flight options, airlines, tips for finding deals, and an estimated cost breakdown.

Travel Details:
- From: ${formData.from}
- To: ${formData.to}
- Trip Type: ${formData.tripType}
- Departure Date: ${formData.departureDate}
${formData.tripType === 'roundtrip' ? `- Return Date: ${formData.returnDate}` : ''}
- Passengers: ${formData.passengers}
- Cabin Class: ${formData.cabinClass}
- Total Budget: $${formData.budget}
- Date Flexibility: ${formData.flexibility}
${formData.preferences ? `- Additional Preferences: ${formData.preferences}` : ''}

Please provide:
1. Best airlines and estimated prices for this route
2. Tips to find the cheapest flights within budget
3. Recommended booking platforms
4. Layover or connection options
5. Baggage and extra fee considerations`
}

/**
 * Create a flight plan prompt using REAL flight data
 * @param {object} formData - The flight planner form data
 * @param {array} flights - REAL flight data from API
 * @returns {string} - A formatted prompt for OpenAI
 */
export function createFlightPlanPrompt(formData, flights = []) {
  if (!flights || flights.length === 0) {
    return `Unfortunately, no flights were found for the selected route. Please try different dates or destinations.`
  }

  const flightsList = flights.map((flight, index) => `
Option ${index + 1}: ${flight.airline} Flight ${flight.flightNumber}
  Departure: ${flight.departure.time} from ${flight.departure.airportName}
  Arrival: ${flight.arrival.time} at ${flight.arrival.airportName}
  Duration: ${flight.duration}
  Stops: ${flight.stopsDescription}
  Price: ${flight.priceFormatted}`).join('\n')

  return `You are a travel planning assistant. A user is looking for flights and you have been provided with REAL flight options from a flight search API.

DO NOT invent, guess, or hallucinate any flight information.
ONLY use the flight data provided below.
DO NOT add additional flights that are not in the list.

USER REQUEST:
- From: ${formData.departureCity}
- To: ${formData.destination}
- Departure Date: ${formData.departureDate}
- Return Date: ${formData.returnDate}
- Budget: ${formData.budget}
- Passengers: ${formData.passengers}
${formData.preferences ? `- Preferences: ${formData.preferences}` : ''}

REAL FLIGHT OPTIONS FROM API:
${flightsList}

YOUR TASK:
1. Select the top 2-3 best options based on:
   - Price (within their budget)
   - Duration (shortest travel time)
   - Number of stops (fewer is better)
   - User preferences

2. For each recommended flight, explain:
   - Why this is a good option
   - Total price and value
   - Travel time considerations

3. Provide a clear recommendation for best value vs best convenience

Remember: ONLY present flights from the list above. If no flights match their criteria, explain why and suggest alternative dates or routes.`
}

/**
 * Create activities planner prompt
 */
export function createActivitiesPlanPrompt(formData) {
  return `Please create a personalized activities itinerary based on the following:

Destination: ${formData.destination}
Travel Dates: ${formData.travelDates}
Activities Budget: ${formData.budget}
Trip Duration: ${formData.duration}
Group Type: ${formData.groupType}
Pace: ${formData.pace}

${formData.activityTypes && formData.activityTypes.length > 0 ? `
Preferred Activity Types:
${formData.activityTypes.join('\n')}
` : ''}

Additional Interests:
${formData.interests}

${formData.specialRequirements ? `Special Requirements: ${formData.specialRequirements}` : ''}

Please provide:
1. Day-by-day activity recommendations
2. Estimated costs for each activity
3. Best times to visit each location
4. Tips for each activity
5. Alternative options for different preferences`
}

/**
 * Create accommodation planner prompt
 */
export function createAccommodationPlanPrompt(formData) {
  return `Please find accommodation options based on:

Destination: ${formData.destination}
Check-in: ${formData.checkInDate}
Check-out: ${formData.checkOutDate}
Budget per Night: ${formData.budgetPerNight}
Accommodation Type: ${formData.accommodationType || 'Any'}
Group Size: ${formData.groupSize} people

${formData.locationPreference ? `Location Preference: ${formData.locationPreference}` : ''}
${formData.neighborhoodVibe ? `Neighborhood Vibe: ${formData.neighborhoodVibe}` : ''}

Desired Amenities:
${formData.amenities || 'Flexible'}

Additional Preferences:
${formData.preferences || 'None'}

Please recommend:
1. 3-5 specific accommodation options (hotels, apartments, resorts)
2. Price breakdown and value analysis
3. Why each location is good for your trip
4. Booking tips and best times to book
5. What to expect from each neighborhood`
}