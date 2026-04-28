import { useState, useEffect } from 'react'
import { sendToOpenAI, createFlightSearchPrompt } from '../utils/openaiClient'
import { saveChat } from '../utils/savedChats'
import './flights.css'

const STORAGE_KEY = 'flightsFormData'

const DEFAULT_FORM = {
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
}

export default function Flights() {
  const [formData, setFormData] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : DEFAULT_FORM
    } catch {
      return DEFAULT_FORM
    }
  })
  const [loading, setLoading]             = useState(false)
  const [result, setResult]               = useState('')
  const [error, setError]                 = useState('')
  const [showSave, setShowSave]           = useState(false)
  const [saveName, setSaveName]           = useState('')
  const [saveConfirmed, setSaveConfirmed] = useState(false)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    } catch {}
  }, [formData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setError('')
    setResult('')
    setShowSave(false)
    setSaveConfirmed(false)

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
      setSaveName(`${formData.from} → ${formData.to}`)
    } catch (err) {
      setError(err.message || 'Failed to get flight suggestions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    if (!saveName.trim()) return
    saveChat({ name: saveName, type: 'flight', result, formData })
    setSaveConfirmed(true)
    setShowSave(false)
  }

  const handleReset = () => {
    setResult('')
    setShowSave(false)
    setSaveConfirmed(false)
  }

  const handleClear = () => {
    setFormData(DEFAULT_FORM)
    sessionStorage.removeItem(STORAGE_KEY)
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

            <div className="result-save-panel">
              {saveConfirmed ? (
                <span className="save-confirmed">✓ Saved — find it under Saved Results</span>
              ) : showSave ? (
                <div className="save-input-row">
                  <input
                    className="save-name-input"
                    type="text"
                    placeholder="Name this result…"
                    value={saveName}
                    onChange={e => setSaveName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSave()}
                    autoFocus
                  />
                  <button className="save-confirm-btn" onClick={handleSave} disabled={!saveName.trim()}>
                    Save
                  </button>
                  <button className="save-cancel-btn" onClick={() => setShowSave(false)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button className="save-trigger-btn" onClick={() => setShowSave(true)}>
                  🔖 Save Result
                </button>
              )}
            </div>

            <button className="flights-reset" onClick={handleReset}>Search Again</button>
          </div>
        )}

        {!result && (
          <div className="flights-card">

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

            <div className="flights-form-actions">
              <button className="flights-clear" onClick={handleClear}>
                Clear Form
              </button>
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

          </div>
        )}
      </div>
    </div>
  )
}