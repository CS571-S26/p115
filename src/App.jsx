import { useState } from 'react'
import { Nav } from 'react-bootstrap'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import Settings from './settings/Settings' 
import AboutUs from './aboutUs'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const location = useLocation()

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-header mb-4">
          <h2 className="h5 mb-1">Travel Planner</h2>
          <p className="mb-0 small" style={{ color: 'var(--text-muted)' }}>AI planning in the browser</p>
        </div>
        <Nav className="flex-column" activeKey={location.pathname}>
          <Nav.Link as={Link} to="/" eventKey="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/login" eventKey="/login">Login</Nav.Link>
          <Nav.Link as={Link} to="/register" eventKey="/register">Register</Nav.Link>
          <Nav.Link as={Link} to="/aboutUs">About Us</Nav.Link>
          <Nav.Link as={Link} to="/settings" eventKey="/settings">Settings</Nav.Link>
        </Nav>
      </nav>

      <main className="content">
        <Routes>
          <Route path="/" element={
            <div className="page">
              <h1>Welcome to the Travel Planner</h1>
              <p className="mb-0 small" style={{ color: 'var(--text-muted)' }}>Build your itinerary and explore destinations.</p>
              <div className="chat-container mt-4">
                <input
                  className="chat-input border-0"
                  type="text"
                  placeholder="Explain your trip..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button className="submit">Submit</button>
              </div>
            </div>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}

export default App