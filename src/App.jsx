import { Nav } from 'react-bootstrap'
import './App.css'

function App() {
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
        </div>
      </main>
    </div>
  )
}

export default App
