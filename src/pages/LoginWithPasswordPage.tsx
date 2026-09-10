import React, { useState } from 'react'
import type { StatusState } from '../common/types'
import { setTokens } from '../common/auth'

// ----- Constants -------------------------------------------------------------

const DEFAULT_EMAIL = 'user123@email.com'
const DEFAULT_PASSWORD = 'password123'
const API_ENDPOINT = 'http://localhost:8080/api/v1/auth/login/password'

// ----- API function ----------------------------------------------------------

async function loginUser(email: string, password: string) {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()
  return { response, data }
}

// ----- Component -------------------------------------------------------------

const LoginWithPasswordPage: React.FC = () => {
  const [email, setEmail] = useState(DEFAULT_EMAIL)
  const [password, setPassword] = useState(DEFAULT_PASSWORD)
  const [status, setStatus] = useState<StatusState>({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })
    setIsLoading(true)

    try {
      const { response, data } = await loginUser(email, password)
      console.log('Login response:', JSON.stringify({ status: response.status, data }, null, 2))

      if (response.ok) {
        setTokens(data.access_token, data.refresh_token)

        setStatus({
          type: 'success',
          message: 'Login successful! Access token stored in memory, refresh token in sessionStorage. (Here a redirection happens...)',
        })
      } else {
        const errorMessage =
          data.error_msg || data.description || data.detail || data.message || 'Login failed'
        setStatus({
          type: 'error',
          message: `Error ${response.status}: ${errorMessage}`,
        })
      }
    } catch (error) {
      console.error('Network error:', error)
      setStatus({
        type: 'error',
        message: 'Network error – unable to reach the backend.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-4xl font-bold text-olive-800 mb-2">Log In</h1>
      <p className="text-lg text-olive-600 mb-8">
        Sign in with your email and password
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4"
      >
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

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-olive-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="mt-1 w-full px-3 py-2 border border-olive-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-olive-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-olive-700 hover:bg-olive-800 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>

        {status.message && (
          <div
            className={`mt-4 p-3 rounded-md text-sm ${status.type === 'success'
                ? 'bg-green-100 text-green-800'
                : status.type === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
          >
            {status.message}
          </div>
        )}

      </form>
    </div>
  )
}

export default LoginWithPasswordPage
