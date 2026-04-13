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
export async function sendToOpenAI(prompt, model = 'gpt-3.5-turbo') {
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
        temperature: 0.7,
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
