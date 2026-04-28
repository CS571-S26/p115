import { useState, useEffect } from 'react'
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

const STORAGE_KEY = 'activities_form'

const DEFAULT_FORM = {
  destination: '',
  travelDates: '',
  duration: '',
  budget: '',
  groupType: 'solo',
  pace: 'moderate',
  activityTypes: [],
  interests: '',
  specialRequirements: ''
}

// ─── Badge → CSS class map ────────────────────
const BADGE_CLASS = {
  'Must-do':         'ac-badge-mustdo',
  'Hidden gem':      'ac-badge-hidden',
  'Best for groups': 'ac-badge-groups',
  'Budget pick':     'ac-badge-budget',
}

// ─── Single activity card ─────────────────────
function ActivityCard({ activity, index }) {
  const badgeClass = BADGE_CLASS[activity.badge] ?? 'ac-badge-mustdo'

  return (
    <div className="ac-card" style={{ animationDelay: `${index * 90}ms` }}>
      <div className="ac-header">
        <div className="ac-header-left">
          <span className={`ac-badge ${badgeClass}`}>{activity.badge}</span>
          <p className="ac-name">{activity.name}</p>
          <p className="ac-meta">{activity.category} · {activity.duration}</p>
          <p className="ac-meta">Best time: {activity.bestTime}</p>
        </div>
        <div className="ac-cost-block">
          <p className="ac-cost">${activity.estimatedCost}</p>
          <p className="ac-cost-label">est. per person</p>
        </div>
      </div>

      <div className="ac-divider" />

      <ul className="ac-highlights">
        {activity.highlights.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>

      <p className="ac-reason">{activity.reason}</p>

      {activity.tip && (
        <div className="ac-tip">
          <span className="ac-tip-icon">&#9432;</span>
          {activity.tip}
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────
export default function Activities() {
  const [formData, setFormData] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : DEFAULT_FORM
    } catch {
      return DEFAULT_FORM
    }
  })
  const [loading, setLoading]             = useState(false)
  const [activities, setActivities]       = useState([])
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
    setActivities([])
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
      const raw = await sendToOpenAI(prompt)
      const cleaned = raw.trim().replace(/^```(?:json)?|```$/gm, '').trim()
      const parsed = JSON.parse(cleaned)
      setActivities(parsed)
      setSaveName(`Activities in ${formData.destination}`)
    } catch (err) {
      if (err.message.includes('JSON') || err.message.includes('Unexpected token')) {
        setError('Unexpected response format. Please try again.')
      } else {
        setError(err.message || 'Failed to get activity suggestions. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    if (!saveName.trim()) return
    saveChat({ name: saveName, type: 'activity', result: JSON.stringify(activities), formData })
    setSaveConfirmed(true)
    setShowSave(false)
  }

  const handleReset = () => {
    setActivities([])
    setShowSave(false)
    setSaveConfirmed(false)
  }

  const handleClear = () => {
    setFormData(DEFAULT_FORM)
    sessionStorage.removeItem(STORAGE_KEY)
  }

  // ── Results view ──────────────────────────────
  if (activities.length > 0) {
    return (
      <div className="activities-page">
        <div className="activities-container">
          <div className="activities-header">
            <h1>Activity Planner</h1>
            <p className="activities-subtitle">
              {formData.destination} · {formData.travelDates}
            </p>
          </div>

          <p className="activities-result-count">
            {activities.length} experiences · curated for your travel style
          </p>

          {activities.map((activity, i) => (
            <ActivityCard key={`${activity.name}-${i}`} activity={activity} index={i} />
          ))}

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

          <button className="activities-reset" onClick={handleReset}>
            ← Plan Again
          </button>
        </div>
      </div>
    )
  }

  // ── Search form ───────────────────────────────
  return (
    <div className="activities-page">
      <div className="activities-container">

        <div className="activities-header">
          <h1>Activity Planner</h1>
          <p className="activities-subtitle">Discover the best experiences for your trip</p>
        </div>

        {error && <div className="activities-error">⚠ {error}</div>}

        {!activities.length && (
          <div className="activities-card">

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

            <div className="activities-form-actions">
              <button className="activities-clear" onClick={handleClear}>
                Clear Form
              </button>
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

          </div>
        )}
      </div>
    </div>
  )
}