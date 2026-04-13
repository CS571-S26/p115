import { useState } from 'react'
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap'
import { sendToOpenAI, createTravelPlanPrompt } from './utils/openaiClient'
import './travelPlan.css'

export default function TravelPlan() {
  const [formData, setFormData] = useState({
    destination: '',
    destinationDetails: '',
    budget: '',
    budgetDetails: '',
    departureCity: '',
    departureCityDetails: '',
    travelDates: '',
    travelDatesDetails: '',
    budgetPerNight: '',
    budgetPerNightDetails: '',
    vibe: '',
    otherInfo: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Validate required fields
  const validateForm = () => {
    const requiredFields = ['destination', 'budget', 'departureCity', 'travelDates', 'budgetPerNight', 'vibe']
    const missingFields = requiredFields.filter(field => !formData[field].trim())
    
    if (missingFields.length > 0) {
      return {
        isValid: false,
        message: `Please fill out all required fields: ${missingFields.join(', ')}`
      }
    }
    return { isValid: true }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult('')

    // Validate form
    const validation = validateForm()
    if (!validation.isValid) {
      setError(validation.message)
      console.warn('Form validation failed:', validation.message)
      return
    }

    console.log('✓ Form validation passed')
    console.log('📝 Form data:', formData)

    // Call OpenAI API
    setLoading(true)
    console.log('🔄 Sending request to OpenAI API...')
    
    try {
      const prompt = createTravelPlanPrompt(formData)
      console.log('📤 Prompt sent to OpenAI')
      
      const response = await sendToOpenAI(prompt)
      console.log('✅ Response received from OpenAI:', response)
      
      setResult(response)
      console.log('🎉 Travel plan generated successfully!')
    } catch (err) {
      const errorMessage = err.message || 'Failed to generate travel plan. Please try again.'
      setError(errorMessage)
      console.error('❌ OpenAI Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="travel-plan-page">
      <div className="travel-plan-container">
        <h1>Tell Us About Your Trip</h1>
        <p className="subtitle">Let us know your travel preferences and we'll create the perfect itinerary</p>
        
        {error && (
          <Alert variant="danger" className="mb-4">
            ❌ {error}
          </Alert>
        )}

        {loading && (
          <Card className="travel-plan-card mb-4 bg-light">
            <Card.Body className="text-center">
              <Spinner animation="border" role="status" className="mb-3">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mb-0"><strong>🔄 Generating your AI travel plan...</strong></p>
              <small className="text-muted">This may take a moment</small>
            </Card.Body>
          </Card>
        )}

        {result && (
          <Card className="travel-plan-card mb-4">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">✨ Your AI Travel Plan</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {result}
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setResult('')}
                className="mt-3"
              >
                Create Another Plan
              </Button>
            </Card.Body>
          </Card>
        )}
        
        {!result && (
          <Card className="travel-plan-card">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
              {/* Question 1: Destination */}
              <Form.Group className="mb-4">
                <Form.Label className="form-label">
                  Where would you like to go? <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="destination"
                  placeholder="e.g., Paris, Tokyo, Bali"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <Form.Control
                  as="textarea"
                  name="destinationDetails"
                  placeholder="Any additional details about your destination preferences..."
                  value={formData.destinationDetails}
                  onChange={handleChange}
                  rows={2}
                  className="form-input mt-2"
                />
              </Form.Group>

              {/* Question 2: Budget */}
              <Form.Group className="mb-4">
                <Form.Label className="form-label">
                  What's your total budget? <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="budget"
                  placeholder="e.g., $5,000"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <Form.Control
                  as="textarea"
                  name="budgetDetails"
                  placeholder="Any additional budget details or flexibility..."
                  value={formData.budgetDetails}
                  onChange={handleChange}
                  rows={2}
                  className="form-input mt-2"
                />
              </Form.Group>

              {/* Question 3: Departure City */}
              <Form.Group className="mb-4">
                <Form.Label className="form-label">
                  Where will you be traveling from? <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="departureCity"
                  placeholder="e.g., New York, London, Sydney"
                  value={formData.departureCity}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <Form.Control
                  as="textarea"
                  name="departureCityDetails"
                  placeholder="Any location preferences or constraints..."
                  value={formData.departureCityDetails}
                  onChange={handleChange}
                  rows={2}
                  className="form-input mt-2"
                />
              </Form.Group>

              {/* Question 4: Dates of Travel */}
              <Form.Group className="mb-4">
                <Form.Label className="form-label">
                  When would you like to travel? <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="travelDates"
                  placeholder="e.g., July 15-22, 2024"
                  value={formData.travelDates}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <Form.Control
                  as="textarea"
                  name="travelDatesDetails"
                  placeholder="Any flexibility or specific constraints on dates..."
                  value={formData.travelDatesDetails}
                  onChange={handleChange}
                  rows={2}
                  className="form-input mt-2"
                />
              </Form.Group>

              {/* Question 5: Budget Per Night */}
              <Form.Group className="mb-4">
                <Form.Label className="form-label">
                  Budget per night for hotels? <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="budgetPerNight"
                  placeholder="e.g., $150/night"
                  value={formData.budgetPerNight}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <Form.Control
                  as="textarea"
                  name="budgetPerNightDetails"
                  placeholder="Accommodation preferences, must-haves, or alternatives..."
                  value={formData.budgetPerNightDetails}
                  onChange={handleChange}
                  rows={2}
                  className="form-input mt-2"
                />
              </Form.Group>

              {/* Question 6: Vibe and Activities */}
              <Form.Group className="mb-4">
                <Form.Label className="form-label">
                  What vibe do you have when traveling? What type of activities do you like? <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  name="vibe"
                  placeholder="e.g., Adventure seeker, cultural explorer, relaxation focused, foodie, beach lover, hiking enthusiast..."
                  value={formData.vibe}
                  onChange={handleChange}
                  rows={3}
                  required
                  className="form-input"
                />
              </Form.Group>

              {/* Question 7: Other Info */}
              <Form.Group className="mb-4">
                <Form.Label className="form-label">
                  Any other important information?
                </Form.Label>
                <Form.Control
                  as="textarea"
                  name="otherInfo"
                  placeholder="e.g., Travel companions, dietary restrictions, accessibility needs, visa requirements, language spoken, any specific must-sees..."
                  value={formData.otherInfo}
                  onChange={handleChange}
                  rows={3}
                  className="form-input"
                />
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="submit-btn w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Generating Your Travel Plan...
                  </>
                ) : (
                  'Plan My Trip'
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
        )}
      </div>
    </div>
  )
}
