import { useState } from 'react'
import { Nav, Button } from 'react-bootstrap'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import Settings from './settings/Settings' 
import AboutUs from './aboutUs'
import TravelPlan from './TravelPlan'
import './App.css'

// Protected Route Component
function ProtectedRoute({ isLoggedIn, element }) {
  return isLoggedIn ? element : <Navigate to="/login" replace />
}

function App() {
  const [message, setMessage] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const location = useLocation()

  const handleLogin = () => {
    setLoggedIn(true)
  }

  const handleLogout = () => {
    setLoggedIn(false)
  }

  return (
    <div className={`app ${!loggedIn ? 'no-sidebar' : ''}`}>
      {loggedIn && (
        <nav className="sidebar">
          <div className="sidebar-header mb-4">
            <h2 className="h5 mb-1">Travel Planner</h2>
            <p className="mb-0 small" style={{ color: 'var(--text-muted)' }}>AI planning in the browser</p>
          </div>
          <Nav className="flex-column" activeKey={location.pathname}>
            <Nav.Link as={Link} to="/" eventKey="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/plan" eventKey="/plan">Plan a Trip</Nav.Link>
            <Nav.Link as={Link} to="/aboutUs" eventKey="/aboutUs">About Us</Nav.Link>
            <Nav.Link as={Link} to="/settings" eventKey="/settings">Settings</Nav.Link>
            <hr style={{ borderColor: 'var(--border)', margin: '1rem 0' }} />
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={handleLogout}
              className="w-100 mt-2"
            >
              Logout
            </Button>
          </Nav>
        </nav>
      )}

      <main className="content">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute 
              isLoggedIn={loggedIn} 
              element={
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
              }
            />
          } />
          <Route path="/plan" element={
            <ProtectedRoute isLoggedIn={loggedIn} element={<TravelPlan />} />
          } />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="/aboutUs" element={
            <ProtectedRoute isLoggedIn={loggedIn} element={<AboutUs />} />
          } />
          <Route path="/settings" element={
            <ProtectedRoute isLoggedIn={loggedIn} element={<Settings />} />
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App