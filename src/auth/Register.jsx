import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from './firebase'
import './auth.css'

function Register(){
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

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

  const handleSubmit = async (event) => {
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
    setSubmitError('')
    setSubmitSuccess('')

    try {
      await registerUser(email, password)
      setSubmitSuccess('Account created! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1200)
    } catch (error) {
      // Firebase error codes: https://firebase.google.com/docs/auth/admin/errors
      const message =
        error?.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists.'
          : error?.code === 'auth/weak-password'
          ? 'The password is too weak. Please choose a stronger one.'
          : error?.message || 'Unable to create account. Please try again.'
      setSubmitError(message)
    }
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
          {submitError && <div className="text-danger" style={{ fontSize: '0.85rem' }}>{submitError}</div>}
          {submitSuccess && <div className="text-success" style={{ fontSize: '0.85rem' }}>{submitSuccess}</div>}

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
