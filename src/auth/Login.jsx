import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from './firebase'
import './auth.css'

function Login(){
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoginError('')

    try {
      await loginUser(email, password)
      navigate('/')
    } catch (error) {
      const message =
        error?.code === 'auth/user-not-found'
          ? 'No account found with this email.'
          : error?.code === 'auth/wrong-password'
          ? 'Incorrect password. Please try again.'
          : error?.code === 'auth/too-many-requests'
          ? 'Too many attempts. Please try again later.'
          : error?.message || 'Unable to login. Please try again.'
      setLoginError(message)
    }
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

          {loginError && <div className="text-danger" style={{ fontSize: '0.85rem' }}>{loginError}</div>}

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
