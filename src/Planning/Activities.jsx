import { useState } from 'react'
import { sendToOpenAI, createActivitiesPlanPrompt } from '../utils/openaiClient'
import { saveChat } from '../utils/savedChats'
import './activities.css'

const ACTIVITY_TYPES = [
  'Outdoor & Adventure',
  'Culture & History',
  'Food & Dining',
  'Nightlife & Entertainment',
  'Relaxation & Wellness',
  'Shopping',
  'Sports & Fitness',
  'Art & Museums',
  'Nature & Wildlife',
  'Family-Friendly'
]

export default function Activities() {
  const [formData, setFormData] = useState({
    destination: '',
    travelDates: '',
    duration: '',
    budget: '',
    groupType: 'solo',
    pace: 'moderate',
    activityTypes: [],
    interests: '',
    specialRequirements: ''
  })
  const [loading, setLoading]             = useState(false)
  const [result, setResult]               = useState('')
  const [error, setError]                 = useState('')
  const [showSave, setShowSave]           = useState(false)
  const [saveName, setSaveName]           = useState('')
  const [saveConfirmed, setSaveConfirmed] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleActivityType = (type) => {
    setFormData(prev => ({
      ...prev,
      activityTypes: prev.activityTypes.includes(type)
        ? prev.activityTypes.filter(t => t !== type)
        : [...prev.activityTypes, type]
    }))
  }

  const handleSubmit = async () => {
    setError('')
    setResult('')
    setShowSave(false)
    setSaveConfirmed(false)

    const required = ['destination', 'travelDates', 'budget']
    const missing = required.filter(f => !formData[f].trim())
    if (missing.length > 0) {
      setError(`Please fill out: ${missing.join(', ')}`)
      return
    }

    setLoading(true)
    try {
      const prompt = createActivitiesPlanPrompt(formData)
      const text = await sendToOpenAI(prompt)
      setResult(text)
      setSaveName(`Activities in ${formData.destination}`)
    } catch (err) {
      setError(err.message || 'Failed to get activity suggestions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    if (!saveName.trim()) return
    saveChat({ name: saveName, type: 'activity', result, formData })
    setSaveConfirmed(true)
    setShowSave(false)
  }

  const handleReset = () => {
    setResult('')
    setShowSave(false)
    setSaveConfirmed(false)
  }

  return (
    <div className="activities-page">
      <div className="activities-container">

        <div className="activities-header">
          <h1>Activity Planner</h1>
          <p className="activities-subtitle">Discover the best experiences for your trip</p>
        </div>

        {error && <div className="activities-error">⚠ {error}</div>}

        {result && (
          <div className="activities-result">
            <div className="activities-result-header">
              <span>✦</span>
              <h3>Your Activity Recommendations</h3>
              <span>✦</span>
            </div>
            <div className="activities-result-body">{result}</div>

            {/* ── Save panel ── */}
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

            <button className="activities-reset" onClick={handleReset}>Plan Again</button>
          </div>
        )}

        {!result && (
          <div className="activities-card">

            {/* Destination / Dates */}
            <div className="activities-row">
              <div className="activities-field">
                <label className="activities-label">Destination <span className="req">*</span></label>
                <div className="input-icon-wrap">
                  <span className="input-icon">✦</span>
                  <input
                    className="activities-input"
                    type="text"
                    name="destination"
                    placeholder="City or region"
                    value={formData.destination}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="activities-field">
                <label className="activities-label">Travel Dates <span className="req">*</span></label>
                <input
                  className="activities-input"
                  type="text"
                  name="travelDates"
                  placeholder="e.g. July 15–22"
                  value={formData.travelDates}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Duration / Budget */}
            <div className="activities-row">
              <div className="activities-field">
                <label className="activities-label">Trip Duration</label>
                <select className="activities-input" name="duration" value={formData.duration} onChange={handleChange}>
                  <option value="">Select duration</option>
                  <option value="1 day">1 Day</option>
                  <option value="2-3 days">2–3 Days</option>
                  <option value="4-5 days">4–5 Days</option>
                  <option value="1 week">1 Week</option>
                  <option value="2 weeks">2 Weeks</option>
                  <option value="3+ weeks">3+ Weeks</option>
                </select>
              </div>
              <div className="activities-field">
                <label className="activities-label">Activities Budget <span className="req">*</span></label>
                <div className="input-icon-wrap">
                  <span className="input-icon">$</span>
                  <input
                    className="activities-input"
                    type="text"
                    name="budget"
                    placeholder="e.g. 500"
                    value={formData.budget}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Group Type / Pace */}
            <div className="activities-row">
              <div className="activities-field">
                <label className="activities-label">Group Type</label>
                <select className="activities-input" name="groupType" value={formData.groupType} onChange={handleChange}>
                  <option value="solo">Solo</option>
                  <option value="couple">Couple</option>
                  <option value="friends">Friends Group</option>
                  <option value="family with kids">Family with Kids</option>
                  <option value="large group">Large Group</option>
                </select>
              </div>
              <div className="activities-field">
                <label className="activities-label">Trip Pace</label>
                <div className="pace-toggle">
                  {['relaxed', 'moderate', 'packed'].map(pace => (
                    <button
                      key={pace}
                      className={`toggle-btn ${formData.pace === pace ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, pace }))}
                    >
                      {pace.charAt(0).toUpperCase() + pace.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Types */}
            <div className="activities-field full-width">
              <label className="activities-label">Activity Types <span className="label-hint">(select all that apply)</span></label>
              <div className="activity-chips">
                {ACTIVITY_TYPES.map(type => (
                  <button
                    key={type}
                    className={`activity-chip ${formData.activityTypes.includes(type) ? 'active' : ''}`}
                    onClick={() => toggleActivityType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="activities-field full-width">
              <label className="activities-label">Specific Interests</label>
              <textarea
                className="activities-input activities-textarea"
                name="interests"
                placeholder="e.g. street food tours, hidden gems, photography spots, local markets, ancient ruins..."
                value={formData.interests}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {/* Special Requirements */}
            <div className="activities-field full-width">
              <label className="activities-label">Special Requirements</label>
              <input
                className="activities-input"
                type="text"
                name="specialRequirements"
                placeholder="e.g. wheelchair accessible, suitable for young children, no strenuous hiking..."
                value={formData.specialRequirements}
                onChange={handleChange}
              />
            </div>

            <button className="activities-submit" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <span className="loading-text">
                  <span className="spinner" /> Planning Activities...
                </span>
              ) : (
                'Plan My Activities'
              )}
            </button>

          </div>
        )}
      </div>
    </div>
  )
}