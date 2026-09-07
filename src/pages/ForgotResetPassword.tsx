import React, { useState, useEffect } from 'react'
import type { StatusState } from './types' // adjust path as needed

// ----- Constants -------------------------------------------------------------

const DEFAULT_EMAIL = 'user123@email.com'
const FORGOT_PASSWORD_ENDPOINT = 'http://localhost:8080/api/v1/auth/forgot-password'
const RESET_PASSWORD_ENDPOINT = 'http://localhost:8080/api/v1/auth/reset-password'

// ----- API functions ---------------------------------------------------------

async function requestReset(email: string) {
  const response = await fetch(FORGOT_PASSWORD_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const data = await response.json()
  return { response, data }
}

async function resetPassword(token: string, newPassword: string) {
  const response = await fetch(RESET_PASSWORD_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password: newPassword }),
  })
  const data = await response.json()
  return { response, data }
}

// ----- Component -------------------------------------------------------------

const ForgotResetPasswordPage: React.FC = () => {
  // State for request form
  const [email, setEmail] = useState(DEFAULT_EMAIL)
  const [requestStatus, setRequestStatus] = useState<StatusState>({ type: '', message: '' })
  const [isRequestLoading, setIsRequestLoading] = useState(false)

  // State for reset form (token can be manually entered or taken from URL)
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetStatus, setResetStatus] = useState<StatusState>({ type: '', message: '' })
  const [isResetLoading, setIsResetLoading] = useState(false)

  // ----- Request handler ------------------------------------------------------

  const handleRequestSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setRequestStatus({ type: '', message: '' })
    setIsRequestLoading(true)

    try {
      const { response, data } = await requestReset(email)
      console.log('Forgot password response:', JSON.stringify({ status: response.status, data }, null, 2))

      if (response.ok) {
        setRequestStatus({
          type: 'success',
          message: data.message || 'If this email is registered, a reset link will be sent.',
        })
      } else {
        const errorMsg = data.error_msg || data.message || 'Something went wrong'
        setRequestStatus({
          type: 'error',
          message: `Error ${response.status}: ${errorMsg}`,
        })
      }
    } catch (error) {
      console.error('Network error:', error)
      setRequestStatus({
        type: 'error',
        message: 'Network error – unable to reach the backend.',
      })
    } finally {
      setIsRequestLoading(false)
    }
  }

  // ----- Reset handler --------------------------------------------------------
  const handleResetSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setResetStatus({ type: '', message: '' })

    if (newPassword !== confirmPassword) {
      setResetStatus({
        type: 'error',
        message: 'Passwords do not match.',
      })
      return
    }

    if (!token) {
      setResetStatus({
        type: 'error',
        message: 'Please enter the reset token.',
      })
      return
    }

    setIsResetLoading(true)

    try {
      const { response, data } = await resetPassword(token, newPassword)
      console.log('Reset password response:', JSON.stringify({ status: response.status, data }, null, 2))

      if (response.ok) {
        setResetStatus({
          type: 'success',
          message: data.message || 'Password reset successfully! You can now log in.',
        })
      } else {
        const errorMsg = data.error_msg || data.message || 'Reset failed. Please try again.'
        setResetStatus({
          type: 'error',
          message: `Error ${response.status}: ${errorMsg}`,
        })
      }
    } catch (error) {
      console.error('Network error:', error)
      setResetStatus({
        type: 'error',
        message: 'Network error – unable to reach the backend.',
      })
    } finally {
      setIsResetLoading(false)
    }
  }

  // ----- Render --------------------------------------------------------------
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-4xl font-bold text-olive-800 mb-2">Forgot & Reset Password</h1>
      <p className="text-lg text-olive-600 mb-8">
        Demo both workflows: request a reset link and then reset your password.
      </p>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ----- REQUEST RESET LINK FORM ----- */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-olive-800 mb-4">1. Request Reset Link</h2>
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-olive-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-1 w-full px-3 py-2 border border-olive-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-olive-500"
                placeholder="user@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isRequestLoading}
              className="w-full bg-olive-700 hover:bg-olive-800 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRequestLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            {requestStatus.message && (
              <div
                className={`mt-4 p-3 rounded-md text-sm ${
                  requestStatus.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : requestStatus.type === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {requestStatus.message}
              </div>
            )}
          </form>
        </div>

        {/* ----- RESET PASSWORD FORM ----- */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-olive-800 mb-4">2. Reset Password</h2>
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <label htmlFor="reset-token" className="block text-sm font-medium text-olive-700">
                Reset Token
              </label>
              <input
                id="reset-token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 border border-olive-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-olive-500"
                placeholder="Enter token from email"
              />
            </div>

            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-olive-700">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="mt-1 w-full px-3 py-2 border border-olive-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-olive-500"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-olive-700">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="mt-1 w-full px-3 py-2 border border-olive-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-olive-500"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={isResetLoading}
              className="w-full bg-olive-700 hover:bg-olive-800 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResetLoading ? 'Resetting...' : 'Reset Password'}
            </button>

            {resetStatus.message && (
              <div
                className={`mt-4 p-3 rounded-md text-sm ${
                  resetStatus.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : resetStatus.type === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {resetStatus.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotResetPasswordPage
