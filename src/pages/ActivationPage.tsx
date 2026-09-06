import React, { useState } from 'react'
import type { StatusState } from './types'


// ----- Constants -------------------------------------------------------------

const API_ENDPOINT = 'http://localhost:8080/api/v1/auth/activate'


// ----- API function ----------------------------------------------------------

async function activateAccount(token: string) {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })

  const data = await response.json()
  return { response, data }
}

// ----- Component -------------------------------------------------------------

const ActivationPage: React.FC = () => {
  const [token, setToken] = useState('')
  const [status, setStatus] = useState<StatusState>({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })
    setIsLoading(true)

    try {
      const { response, data } = await activateAccount(token)
      console.log('Activation response:', JSON.stringify({ status: response.status, data }, null, 2))

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Account activated successfully! You can now log in.',
        })
      } else {
        const errorMessage =
          data.error_msg || 'Activation failed. Please check your token.'

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
      <h1 className="text-4xl font-bold text-olive-800 mb-2">Activate Your Account</h1>
      <p className="text-lg text-olive-600 mb-8">
        Paste the activation token you received to verify your account
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-olive-700">
            Activation Token
          </label>
          <input
            id="token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            autoComplete="off"
            className="mt-1 w-full px-3 py-2 border border-olive-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-olive-500"
            placeholder="Paste your token here"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-olive-700 hover:bg-olive-800 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Activating...' : 'Activate Account'}
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

export default ActivationPage
