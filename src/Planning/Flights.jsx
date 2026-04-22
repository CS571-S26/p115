import { useState } from 'react'
import { sendToOpenAI, createFlightSearchPrompt } from '../utils/openaiClient'
import './flights.css'

export default function Flights() {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    tripType: 'roundtrip',
    passengers: '1',
    cabinClass: 'economy',
    budget: '',
    flexibility: 'exact',
    preferences: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setError('')
    setResult('')

    const required = ['from', 'to', 'departureDate', 'budget']
    const missing = required.filter(f => !formData[f].trim())
    if (missing.length > 0) {
      setError(`Please fill out: ${missing.join(', ')}`)
      return
    }
    if (formData.tripType === 'roundtrip' && !formData.returnDate) {
      setError('Please select a return date for round trips.')
      return
    }

    setLoading(true)
    try {
      const prompt = createFlightSearchPrompt(formData)
      const text = await sendToOpenAI(prompt)
      setResult(text)
    } catch (err) {
      setError(err.message || 'Failed to get flight suggestions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flights-page">
      <div className="flights-container">

        <div className="flights-header">
          <h1>Flight Finder</h1>
          <p className="flights-subtitle">Tell us where you're headed and we'll find the best options</p>
        </div>

        {error && <div className="flights-error">⚠ {error}</div>}

        {result && (
          <div className="flights-result">
            <div className="flights-result-header">
              <span>✦</span>
              <h3>Your Flight Recommendations</h3>
              <span>✦</span>
            </div>
            <div className="flights-result-body">{result}</div>
            <button className="flights-reset" onClick={() => setResult('')}>Search Again</button>
          </div>
        )}

        {!result && (
          <div className="flights-card">

            {/* Trip Type Toggle */}
            <div className="trip-type-toggle">
              {['roundtrip', 'oneway', 'multicity'].map(type => (
                <button
                  key={type}
                  className={`toggle-btn ${formData.tripType === type ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, tripType: type }))}
                >
                  {type === 'roundtrip' ? 'Round Trip' : type === 'oneway' ? 'One Way' : 'Multi-City'}
                </button>
              ))}
            </div>

            {/* From / To */}
            <div className="flights-row">
              <div className="flights-field">
                <label className="flights-label">From <span className="req">*</span></label>
                <div className="input-icon-wrap">
                  <span className="input-icon">✈</span>
                  <input
                    className="flights-input"
                    type="text"
                    name="from"
                    placeholder="Departure city or airport"
                    value={formData.from}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="swap-icon">⇄</div>
              <div className="flights-field">
                <label className="flights-label">To <span className="req">*</span></label>
                <div className="input-icon-wrap">
                  <span className="input-icon">✈</span>
                  <input
                    className="flights-input"
                    type="text"
                    name="to"
                    placeholder="Destination city or airport"
                    value={formData.to}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="flights-row">
              <div className="flights-field">
                <label className="flights-label">Departure Date <span className="req">*</span></label>
                <input
                  className="flights-input"
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                />
              </div>
              {formData.tripType === 'roundtrip' && (
                <div className="flights-field">
                  <label className="flights-label">Return Date <span className="req">*</span></label>
                  <input
                    className="flights-input"
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>

            {/* Passengers / Class */}
            <div className="flights-row">
              <div className="flights-field">
                <label className="flights-label">Passengers</label>
                <select className="flights-input" name="passengers" value={formData.passengers} onChange={handleChange}>
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                </select>
              </div>
              <div className="flights-field">
                <label className="flights-label">Cabin Class</label>
                <select className="flights-input" name="cabinClass" value={formData.cabinClass} onChange={handleChange}>
                  <option value="economy">Economy</option>
                  <option value="premium_economy">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>

            {/* Budget / Flexibility */}
            <div className="flights-row">
              <div className="flights-field">
                <label className="flights-label">Total Budget <span className="req">*</span></label>
                <div className="input-icon-wrap">
                  <span className="input-icon">$</span>
                  <input
                    className="flights-input"
                    type="text"
                    name="budget"
                    placeholder="e.g. 800"
                    value={formData.budget}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flights-field">
                <label className="flights-label">Date Flexibility</label>
                <select className="flights-input" name="flexibility" value={formData.flexibility} onChange={handleChange}>
                  <option value="exact">Exact dates</option>
                  <option value="1-2">± 1–2 days</option>
                  <option value="3-5">± 3–5 days</option>
                  <option value="week">± 1 week</option>
                </select>
              </div>
            </div>

            {/* Preferences */}
            <div className="flights-field full-width">
              <label className="flights-label">Additional Preferences</label>
              <textarea
                className="flights-input flights-textarea"
                name="preferences"
                placeholder="e.g. direct flights only, specific airlines, window seat, avoid red-eyes..."
                value={formData.preferences}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <button className="flights-submit" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <span className="loading-text">
                  <span className="spinner" /> Searching Flights...
                </span>
              ) : (
                'Find My Flights'
              )}
            </button>

          </div>
        )}
      </div>
    </div>
  )
}