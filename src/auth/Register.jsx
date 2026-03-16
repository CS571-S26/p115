import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './auth.css'

function Register(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  const validatePassword = (value) => {
    if (value.length < 7) {
      return 'Password must be at least 7 characters long.'
    }
    if (!/[A-Z]/.test(value)) {
      return 'Password must include at least one uppercase letter.'
    }
    if (!/[a-z]/.test(value)) {
      return 'Password must include at least one lowercase letter.'
    }
    if (!/[0-9]/.test(value)) {
      return 'Password must include at least one number.'
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      return 'Password must include at least one special character (e.g. !@#$%).'
    }

    return ''
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.')
      return
    }

    const passwordValidationError = validatePassword(password)
    if (passwordValidationError) {
      setPasswordError(passwordValidationError)
      return
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    setEmailError('')
    setPasswordError('')
    // TODO: add registration logic (e.g., Firebase createUserWithEmailAndPassword)
    console.log('register', { email, password })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <h1>Create account</h1>
          <p>Enter your email and choose a password.</p>
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
          {emailError && <div className="text-danger" style={{ fontSize: '0.85rem' }}>{emailError}</div>}

          <input
            className="auth-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="auth-input"
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {passwordError && <div className="text-danger" style={{ fontSize: '0.85rem' }}>{passwordError}</div>}

          <Button type="submit" className="auth-button auth-button-primary" variant="primary">
            Register
          </Button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
