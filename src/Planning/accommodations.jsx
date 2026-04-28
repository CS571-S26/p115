import { useState, useEffect } from 'react'
import { sendToOpenAI, createAccommodationPlanPrompt } from '../utils/openaiClient'
import { saveChat } from '../utils/savedChats'
import './Accommodations.css'

const STORAGE_KEY = 'accommodations_form'

const DEFAULT_FORM = {
  destination: '',
  checkInDate: '',
  checkOutDate: '',
  budgetPerNight: '',
  accommodationType: 'hotel',
  groupSize: '1',
  locationPreference: '',
  neighborhoodVibe: '',
  amenities: '',
  preferences: ''
}

export default function Accommodation() {
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

    const required = ['destination', 'checkInDate', 'checkOutDate', 'budgetPerNight']
    const missing = required.filter(f => !formData[f].trim())
    if (missing.length > 0) {
      setError(`Please fill out: ${missing.join(', ')}`)
      return
    }

    setLoading(true)
    try {
      const prompt = createAccommodationPlanPrompt(formData)
      const text = await sendToOpenAI(prompt)
      setResult(text)
      setSaveName(`${formData.accommodationType} in ${formData.destination}`)
    } catch (err) {
      setError(err.message || 'Failed to get accommodation suggestions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    if (!saveName.trim()) return
    saveChat({ name: saveName, type: 'accommodation', result, formData })
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
    <div className="accom-page">
      <div className="accom-container">

        <div className="accom-header">
          <h1>Accommodation Finder</h1>
          <p className="accom-subtitle">Find the perfect place to stay for your trip</p>
        </div>

        {error && <div className="accom-error">⚠ {error}</div>}

        {result && (
          <div className="accom-result">
            <div className="accom-result-header">
              <span>✦</span>
              <h3>Your Accommodation Recommendations</h3>
              <span>✦</span>
            </div>
            <div className="accom-result-body">{result}</div>

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

            <button className="accom-reset" onClick={handleReset}>Search Again</button>
          </div>
        )}

        {!result && (
          <div className="accom-card">

            <div className="accom-type-toggle">
              {[
                { value: 'hotel', label: 'Hotel' },
                { value: 'apartment', label: 'Apartment' },
                { value: 'resort', label: 'Resort' },
                { value: 'hostel', label: 'Hostel' },
                { value: 'any', label: 'Any' }
              ].map(type => (
                <button
                  key={type.value}
                  className={`toggle-btn ${formData.accommodationType === type.value ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, accommodationType: type.value }))}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <div className="accom-row">
              <div className="accom-field">
                <label className="accom-label">Destination <span className="req">*</span></label>
                <div className="input-icon-wrap">
                  <span className="input-icon">⌂</span>
                  <input
                    className="accom-input"
                    type="text"
                    name="destination"
                    placeholder="City or region"
                    value={formData.destination}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="accom-field" style={{ maxWidth: '180px' }}>
                <label className="accom-label">Guests</label>
                <select className="accom-input" name="groupSize" value={formData.groupSize} onChange={handleChange}>
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="accom-row">
              <div className="accom-field">
                <label className="accom-label">Check-in <span className="req">*</span></label>
                <input
                  className="accom-input"
                  type="date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleChange}
                />
              </div>
              <div className="accom-field">
                <label className="accom-label">Check-out <span className="req">*</span></label>
                <input
                  className="accom-input"
                  type="date"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="accom-row">
              <div className="accom-field">
                <label className="accom-label">Budget per Night <span className="req">*</span></label>
                <div className="input-icon-wrap">
                  <span className="input-icon">$</span>
                  <input
                    className="accom-input"
                    type="text"
                    name="budgetPerNight"
                    placeholder="e.g. 150"
                    value={formData.budgetPerNight}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="accom-field">
                <label className="accom-label">Neighborhood Vibe</label>
                <select className="accom-input" name="neighborhoodVibe" value={formData.neighborhoodVibe} onChange={handleChange}>
                  <option value="">No preference</option>
                  <option value="city center">City Center</option>
                  <option value="quiet and residential">Quiet & Residential</option>
                  <option value="beachfront">Beachfront</option>
                  <option value="trendy and nightlife">Trendy & Nightlife</option>
                  <option value="historic district">Historic District</option>
                  <option value="near nature">Near Nature</option>
                </select>
              </div>
            </div>

            <div className="accom-field full-width">
              <label className="accom-label">Location Preference</label>
              <input
                className="accom-input"
                type="text"
                name="locationPreference"
                placeholder="e.g. near the Eiffel Tower, close to the airport, walking distance to beach..."
                value={formData.locationPreference}
                onChange={handleChange}
              />
            </div>

            <div className="accom-field full-width">
              <label className="accom-label">Must-Have Amenities</label>
              <input
                className="accom-input"
                type="text"
                name="amenities"
                placeholder="e.g. pool, gym, free breakfast, parking, pet-friendly, spa..."
                value={formData.amenities}
                onChange={handleChange}
              />
            </div>

            <div className="accom-field full-width">
              <label className="accom-label">Additional Preferences</label>
              <textarea
                className="accom-input accom-textarea"
                name="preferences"
                placeholder="e.g. need a kitchen, prefer a suite, want a great view, travelling with kids..."
                value={formData.preferences}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="accom-form-actions">
              <button className="accom-clear" onClick={handleClear}>
                Clear Form
              </button>
              <button className="accom-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <span className="loading-text">
                    <span className="spinner" /> Finding Accommodations...
                  </span>
                ) : (
                  'Find My Stay'
                )}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}