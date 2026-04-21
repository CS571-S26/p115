import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const DESTINATIONS = [
  { name: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80' },
  { name: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80' },
  { name: 'New York', country: 'USA', img: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=600&q=80' },
  { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' },
  { name: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
  { name: 'Machu Picchu', country: 'Peru', img: 'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=600&q=80' },
]

const FEATURES = [
  { icon: '✦', title: 'AI-Powered Planning', desc: 'Describe your dream trip and get a full itinerary in seconds, tailored to your style.' },
  { icon: '◈', title: 'Smart Recommendations', desc: 'Restaurants, hotels, and experiences curated specifically for you — not just the tourist traps.' },
  { icon: '⬡', title: 'Collaborate & Share', desc: 'Build your itinerary together with friends. Everyone votes, nobody argues.' },
]

function Home({ message, setMessage }) {
  const navigate = useNavigate()
  const [input, setInput] = useState(message || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      setMessage(input)
      navigate('/plan')
    }
  }

  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="home-hero-bg" />
        <div className="home-hero-overlay" />
        <div className="home-hero-content">
          <p className="home-eyebrow">AI Travel Planner</p>
          <h1 className="home-headline">
            Your next<br />
            <em>adventure</em><br />
            starts here.
          </h1>
          <p className="home-sub">Tell us where you want to go — we'll handle the rest.</p>

          <form className="home-search" onSubmit={handleSubmit}>
            <span className="home-search-icon">✈</span>
            <input
              className="home-search-input"
              placeholder="e.g. 10 days in Japan, love food and temples..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="home-search-btn" type="submit">Plan my trip</button>
          </form>
        </div>

        <div className="home-hero-destinations">
          {DESTINATIONS.slice(0, 3).map((d) => (
            <div key={d.name} className="home-hero-chip">
              <img src={d.img} alt={d.name} />
              <span>{d.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="home-section">
        <p className="home-section-label">How it works</p>
        <h2 className="home-section-title">Travel planning,<br />reimagined.</h2>
        <div className="home-features">
          {FEATURES.map((f) => (
            <div key={f.title} className="home-feature-card">
              <span className="home-feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section className="home-section home-section-dark">
        <p className="home-section-label">Explore</p>
        <h2 className="home-section-title">Popular destinations.</h2>
        <div className="home-destinations">
          {DESTINATIONS.map((d) => (
            <div
              key={d.name}
              className="home-dest-card"
              onClick={() => { setInput(`Plan a trip to ${d.name}`); navigate('/plan') }}
            >
              <img src={d.img} alt={d.name} />
              <div className="home-dest-info">
                <span className="home-dest-name">{d.name}</span>
                <span className="home-dest-country">{d.country}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="home-cta">
        <h2>Ready to explore?</h2>
        <p>Your perfect itinerary is one prompt away.</p>
        <button className="home-cta-btn" onClick={() => navigate('/plan')}>Start planning →</button>
      </section>

    </div>
  )
}

export default Home
