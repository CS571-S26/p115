// src/SavedChats/SavedChats.jsx
import { useState, useEffect } from 'react'
import { getSavedChats, deleteChat } from '../utils/savedChats'
import './SavedChats.css'

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
                      <div className="saved-result-text">{chat.result}</div>

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