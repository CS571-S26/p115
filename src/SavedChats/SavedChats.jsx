// src/SavedChats/SavedChats.jsx
import { useState, useEffect } from 'react'
import { getSavedChats, deleteChat } from '../utils/savedChats'
import './SavedChats.css'

// ─── Badge → CSS class map (Flights) ────────────────────
const FLIGHT_BADGE_CLASS = {
  'Best value':      'fc-badge-best',
  'Cheapest':        'fc-badge-cheap',
  'Fastest':         'fc-badge-fast',
  'Most convenient': 'fc-badge-conv',
}

// ─── Badge → CSS class map (Accommodations) ───────────
const ACCOM_BADGE_CLASS = {
  'Best value':      'ac-badge-best',
  'Most luxurious':  'ac-badge-luxury',
  'Best location':   'ac-badge-location',
  'Hidden gem':      'ac-badge-gem',
}

// ─── Badge → CSS class map (Activities) ────────────────
const ACTIVITY_BADGE_CLASS = {
  'Must-do':         'ac-badge-mustdo',
  'Hidden gem':      'ac-badge-hidden',
  'Best for groups': 'ac-badge-groups',
  'Budget pick':     'ac-badge-budget',
}

// ─── Flight card (matches Flights.jsx) ─────────────────
function SavedFlightCard({ flight, index }) {
  const badgeClass = FLIGHT_BADGE_CLASS[flight.badge] ?? 'fc-badge-best'

  return (
    <div className="fc-card" style={{ animationDelay: `${index * 90}ms` }}>
      <div className="fc-header">
        <div className="fc-header-left">
          <span className={`fc-badge ${badgeClass}`}>{flight.badge}</span>
          <p className="fc-airline">{flight.airline} · {flight.flightNumber}</p>
          <p className="fc-meta">{flight.departure} → {flight.arrival} · {flight.duration}</p>
          <p className="fc-meta">
            {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="fc-price-block">
          <p className="fc-price">${flight.estimatedPrice}</p>
          <p className="fc-price-label">est. per person</p>
          {!flight.withinBudget && (
            <p className="fc-over-budget">over budget</p>
          )}
        </div>
      </div>

      <div className="fc-divider" />

      <p className="fc-reason">{flight.reason}</p>

      {flight.tip && (
        <div className="fc-tip">
          <span className="fc-tip-icon">&#9432;</span>
          {flight.tip}
        </div>
      )}
    </div>
  )
}

// ─── Accommodation card (matches accommodations.jsx) ─
function SavedAccomCard({ option, index }) {
  const badgeClass = ACCOM_BADGE_CLASS[option.badge] ?? 'ac-badge-best'
  const stars = '★'.repeat(option.stars) + '☆'.repeat(5 - option.stars)

  return (
    <div className="ac-card" style={{ animationDelay: `${index * 90}ms` }}>
      <div className="ac-header">
        <div className="ac-header-left">
          <span className={`ac-badge ${badgeClass}`}>{option.badge}</span>
          <p className="ac-name">{option.name}</p>
          <p className="ac-meta">{option.type} · {option.neighborhood}</p>
          <p className="ac-meta">{stars} &nbsp;{option.stars}-star</p>
        </div>

        <div className="ac-price-block">
          <p className="ac-price">${option.pricePerNight}</p>
          <p className="ac-price-label">per night</p>
          {!option.withinBudget && (
            <p className="ac-over-budget">over budget</p>
          )}
        </div>
      </div>

      <div className="ac-divider" />

      <p className="ac-reason">{option.reason}</p>

      {option.tip && (
        <div className="ac-tip">
          <span className="ac-tip-icon">&#9432;</span>
          {option.tip}
        </div>
      )}
    </div>
  )
}

// ─── Activity card (matches Activities.jsx) ───────────
function SavedActivityCard({ activity, index }) {
  const badgeClass = ACTIVITY_BADGE_CLASS[activity.badge] ?? 'ac-badge-mustdo'

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

// ─── Render saved results based on type ──────────────
function SavedResultContent({ result, type }) {
  let items = []
  
  try {
    items = typeof result === 'string' ? JSON.parse(result) : result
  } catch {
    return <div className="saved-result-text">{result}</div>
  }

  if (!Array.isArray(items)) {
    items = [items]
  }

  if (items.length === 0) {
    return <p className="saved-no-results">No results to display.</p>
  }

  switch (type) {
    case 'flight':
      return (
        <div className="saved-results-grid">
          {items.map((flight, i) => (
            <SavedFlightCard key={i} flight={flight} index={i} />
          ))}
        </div>
      )
    case 'accommodation':
      return (
        <div className="saved-results-grid">
          {items.map((option, i) => (
            <SavedAccomCard key={i} option={option} index={i} />
          ))}
        </div>
      )
    case 'activity':
      return (
        <div className="saved-results-grid">
          {items.map((activity, i) => (
            <SavedActivityCard key={i} activity={activity} index={i} />
          ))}
        </div>
      )
    default:
      return <div className="saved-result-text">{result}</div>
  }
}

const TYPE_META = {
  flight:        { label: 'Flight',        icon: '✈', cls: 'badge-flight' },
  accommodation: { label: 'Accommodation', icon: '⌂', cls: 'badge-accom' },
  activity:      { label: 'Activity',      icon: '✦', cls: 'badge-activity' },
}

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export default function SavedChats() {
  const [chats, setChats]             = useState([])
  const [expandedId, setExpandedId]   = useState(null)
  const [confirmId, setConfirmId]     = useState(null)

  useEffect(() => { setChats(getSavedChats()) }, [])

  const handleDelete = (id) => {
    deleteChat(id)
    setChats(getSavedChats())
    if (expandedId === id) setExpandedId(null)
    setConfirmId(null)
  }

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id)

  return (
    <div className="saved-page">
      <div className="saved-container">

        <div className="saved-header">
          <h1>Saved Results</h1>
          <p className="saved-subtitle">Your stored flight, accommodation, and activity recommendations</p>
        </div>

        {chats.length === 0 ? (
          <div className="saved-empty">
            <div className="saved-empty-icon">🗂</div>
            <h3>Nothing saved yet</h3>
            <p>
              After receiving a recommendation on any planning page, click{' '}
              <strong>Save Result</strong> to store it here.
            </p>
          </div>
        ) : (
          <div className="saved-list">
            {chats.map(chat => {
              const meta       = TYPE_META[chat.type] ?? TYPE_META.activity
              const isExpanded = expandedId === chat.id
              const isConfirm  = confirmId  === chat.id

              return (
                <div key={chat.id} className={`saved-card ${isExpanded ? 'expanded' : ''}`}>

                  {/* ── Clickable header row ── */}
                  <div className="saved-card-top" onClick={() => toggle(chat.id)}>
                    <div className="saved-card-left">
                      <span className={`saved-badge ${meta.cls}`}>
                        {meta.icon} {meta.label}
                      </span>
                      <span className="saved-card-name">{chat.name}</span>
                    </div>
                    <div className="saved-card-right">
                      <span className="saved-card-date">{formatDate(chat.savedAt)}</span>
                      <span className={`saved-chevron ${isExpanded ? 'open' : ''}`}>›</span>
                    </div>
                  </div>

                  {/* ── Expanded body ── */}
                  {isExpanded && (
                    <div className="saved-card-body">
                      <SavedResultContent result={chat.result} type={chat.type} />

                      <div className="saved-card-actions">
                        {isConfirm ? (
                          <div className="saved-confirm-row">
                            <span className="saved-confirm-label">Delete this result?</span>
                            <button className="saved-btn-yes" onClick={() => handleDelete(chat.id)}>
                              Yes, delete
                            </button>
                            <button className="saved-btn-no" onClick={() => setConfirmId(null)}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button className="saved-btn-delete" onClick={() => setConfirmId(chat.id)}>
                            🗑 Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}