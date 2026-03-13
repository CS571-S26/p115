import { useState } from 'react'
import { Nav, Button } from 'react-bootstrap'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
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
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/login">Login</Nav.Link>
          <Nav.Link as={Link} to="/register">Register</Nav.Link>
        </Nav>
      </nav>

      <main className="content">
        <Routes>
          <Route path="/" element={
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
                <Button className="submit">Submit</Button>
              </div>
            </div>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

