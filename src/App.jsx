import { useState } from 'react'
import { Nav, Button } from 'react-bootstrap'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  return (
    <div className="app">
      <nav className="sidebar bg-light border-end">
        <div className="sidebar-header">
          <h2 className="h5 mb-1">Travel Planner</h2>
          <p className="text-muted mb-0">AI travel planning in the browser</p>
        </div>
        <Nav className="flex-column" activeKey="home">
          <Nav.Link active>Home</Nav.Link>
        </Nav>
      </nav>

      <main className="content">
        <div className="page">
          <h1>Welcome to the Travel Planner</h1>
          <p>Use this space to build your itinerary, explore destinations, and plan your next trip.</p>
          <div className="chat-container">
            <input
              className="chat-input"
              type="text"
              placeholder="Explain your trip..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="submit">Send</button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

