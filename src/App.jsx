import { useState } from 'react'
import { Nav, Button } from 'react-bootstrap'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import Settings from './settings/Settings'
import AboutUs from './aboutUs'
import TravelPlan from './TravelPlan'
import Flights from './Planning/Flights'
import Accommodations from './Planning/accommodations'
import Activities from './Planning/Activities'
import Home from './Home'
import './App.css'

function ProtectedRoute({ isLoggedIn, element }) {
  return isLoggedIn ? element : <Navigate to="/login" replace />
}

function App() {
  const [message, setMessage] = useState('')
  const location = useLocation()

  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem('loggedIn') === 'true'
  })

  const handleLogin = () => {
    localStorage.setItem('loggedIn', 'true')
    setLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('loggedIn')
    setLoggedIn(false)
  }

  return (
    <div className="app">
      {loggedIn && (
        <nav className="topnav">
          <div className="topnav-brand">
            <span className="topnav-title">Travel Planner</span>
          </div>
          <Nav className="topnav-links" activeKey={location.pathname}>
            <Nav.Link as={Link} to="/" eventKey="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/plan" eventKey="/plan">Plan a Trip</Nav.Link>
            <Nav.Link as={Link} to="/flights" eventKey="/flights">Flight Planner</Nav.Link>
            <Nav.Link as={Link} to="/accommodations" eventKey="/accommodations">Accommodations</Nav.Link>
            <Nav.Link as={Link} to="/activities" eventKey="/activities">Activities</Nav.Link>
            <Nav.Link as={Link} to="/aboutUs" eventKey="/aboutUs">About Us</Nav.Link>
            <Nav.Link as={Link} to="/settings" eventKey="/settings">Settings</Nav.Link>
          </Nav>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </nav>
      )}

      <main className="content">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute
              isLoggedIn={loggedIn}
              element={<Home message={message} setMessage={setMessage} />}
            />
          } />
          <Route path="/plan" element={
            <ProtectedRoute isLoggedIn={loggedIn} element={<TravelPlan />} />
          } />
          <Route path="/flights" element={
            <ProtectedRoute isLoggedIn={loggedIn} element={<Flights />} />
          } />
          <Route path="/accommodations" element={
            <ProtectedRoute isLoggedIn={loggedIn} element={<Accommodations />} />
          } />
          <Route path="/activities" element={
            <ProtectedRoute isLoggedIn={loggedIn} element={<Activities />} />
          } />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="/aboutUs" element={
            <ProtectedRoute isLoggedIn={loggedIn} element={<AboutUs />} />
          } />
          <Route path="/settings" element={
            <ProtectedRoute isLoggedIn={loggedIn} element={<Settings onLogout={handleLogout} />} />
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App