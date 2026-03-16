import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './auth.css'

function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    // TODO: add authentication logic (e.g., Firebase sign-in)
    console.log('login', { email, password })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <h1>Login</h1>
          <p>Welcome back! Enter your credentials to continue.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="auth-button auth-button-primary" variant="primary">
            Sign in
          </Button>
        </form>

        <div className="auth-footer">
          Don’t have an account?{' '}
          <Link to="/register" className="auth-link">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
