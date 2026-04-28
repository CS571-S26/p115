/**
 * OpenAI API utilities for travel planning
 * PORTFOLIO EDITION - No API key required
 * 
 * This version displays a message directing users to the portfolio_edition
 * branch for full API functionality.
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

/**
 * Check if API is configured
 */
export function isAPIConfigured() {
  return !!OPENAI_API_KEY
}

/**
 * Alert message for users without API access
 */
export function getNoAPIMessage() {
  return 'To enable AI-powered travel planning, please clone the "portfolio_edition" branch and add your own OpenAI API key to the .env file.'
}

/**
 * Send a prompt to OpenAI and get a response
 * PORTFOLIO EDITION: Shows alert instead of making API call
 */
export async function sendToOpenAI(prompt, model = 'gpt-3.5-turbo', temperature = 0.7) {
  // Portfolio edition - no API key available
  alert(getNoAPIMessage())
  throw new Error('API not configured in portfolio edition')
}

/**
 * Flight search prompt — returns structured JSON so the UI can render cards.
 */
export function createFlightSearchPrompt(formData) {
  return `You are a knowledgeable flight advisor. Based on the travel details below, suggest the 3 best flight options a traveler could realistically find on a platform like Google Flights or Kayak.

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

Respond ONLY with a valid JSON array — no markdown fences, no explanation outside the JSON. Each item must follow this exact shape:

[
  {
    "badge": "Best value",
    "airline": "Delta",
    "flightNumber": "DL 405",
    "departure": "8:00 AM",
    "arrival": "11:14 AM",
    "duration": "5h 14m",
    "stops": 0,
    "estimatedPrice": 312,
    "withinBudget": true,
    "reason": "One sentence on why this is a strong pick for this traveler.",
    "tip": "One practical booking or travel tip specific to this option."
  }
]

Rules:
- badge must be exactly one of: "Best value", "Cheapest", "Fastest", "Most convenient" — each flight gets a unique badge
- stops is a number (0 = nonstop)
- estimatedPrice is a number (per person, in USD)
- withinBudget is true if estimatedPrice × ${formData.passengers} is within the total budget of $${formData.budget}
- Base estimates on real typical pricing for this route and cabin class
- Return exactly 3 items`
}

/**
 * Accommodation search prompt — returns structured JSON so the UI can render cards.
 */
export function createAccommodationPlanPrompt(formData) {
  return `You are a knowledgeable accommodation advisor. Based on the details below, suggest the 3 best accommodation options a traveler could realistically find on platforms like Booking.com or Airbnb.

Stay Details:
- Destination: ${formData.destination}
- Check-in: ${formData.checkInDate}
- Check-out: ${formData.checkOutDate}
- Budget per Night: $${formData.budgetPerNight}
- Accommodation Type: ${formData.accommodationType}
- Guests: ${formData.groupSize}
${formData.neighborhoodVibe ? `- Neighborhood Vibe: ${formData.neighborhoodVibe}` : ''}
${formData.locationPreference ? `- Location Preference: ${formData.locationPreference}` : ''}
${formData.amenities ? `- Must-Have Amenities: ${formData.amenities}` : ''}
${formData.preferences ? `- Additional Preferences: ${formData.preferences}` : ''}

Respond ONLY with a valid JSON array — no markdown fences, no explanation outside the JSON. Each item must follow this exact shape:

[
  {
    "badge": "Best value",
    "name": "Hotel Le Marais",
    "type": "Boutique Hotel",
    "neighborhood": "Le Marais, Paris",
    "pricePerNight": 145,
    "withinBudget": true,
    "stars": 4,
    "highlights": ["Free breakfast", "Rooftop terrace", "5 min walk to Louvre"],
    "reason": "One sentence on why this is a strong pick for this traveler.",
    "tip": "One practical booking tip specific to this property."
  }
]

Rules:
- badge must be exactly one of: "Best value", "Most luxurious", "Best location", "Hidden gem" — each option gets a unique badge
- pricePerNight is a number in USD
- withinBudget is true if pricePerNight is within $${formData.budgetPerNight}
- stars is a number 1–5
- highlights is an array of exactly 3 short strings (amenities or standout features)
- Base estimates on real typical pricing for this destination and accommodation type
- Return exactly 3 items`
}

/**
 * Activities planner prompt — returns structured JSON so the UI can render cards.
 */
export function createActivitiesPlanPrompt(formData) {
  return `You are a knowledgeable travel activities advisor. Based on the details below, suggest the 4 best activities or experiences for this traveler.

Trip Details:
- Destination: ${formData.destination}
- Travel Dates: ${formData.travelDates}
- Budget for Activities: $${formData.budget}
- Trip Duration: ${formData.duration || 'Not specified'}
- Group Type: ${formData.groupType}
- Pace: ${formData.pace}
${formData.activityTypes && formData.activityTypes.length > 0 ? `- Preferred Activity Types: ${formData.activityTypes.join(', ')}` : ''}
${formData.interests ? `- Specific Interests: ${formData.interests}` : ''}
${formData.specialRequirements ? `- Special Requirements: ${formData.specialRequirements}` : ''}

Respond ONLY with a valid JSON array — no markdown fences, no explanation outside the JSON. Each item must follow this exact shape:

[
  {
    "badge": "Must-do",
    "name": "Eiffel Tower at Sunset",
    "category": "Culture & History",
    "duration": "2–3 hours",
    "estimatedCost": 35,
    "bestTime": "Late afternoon",
    "highlights": ["Panoramic city views", "Skip-the-line tickets available", "Iconic photo opportunity"],
    "reason": "One sentence on why this activity is perfect for this traveler.",
    "tip": "One practical insider tip to get the most out of this experience."
  }
]

Rules:
- badge must be exactly one of: "Must-do", "Hidden gem", "Best for groups", "Budget pick" — each activity gets a unique badge
- estimatedCost is a number in USD per person
- duration is a short human-readable string like "2–3 hours" or "Half day"
- bestTime is a short string like "Morning", "Late afternoon", "Evening"
- highlights is an array of exactly 3 short strings
- Return exactly 4 items`
}

/**
 * Create a travel planning prompt from form data
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