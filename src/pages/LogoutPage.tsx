import React, { useState } from 'react'
import type { StatusState } from './types'
import { apiFetch, getRefreshToken, clearTokens } from './auth'

// ----- API functions ---------------------------------------------------------

async function logoutSingleDevice(refreshToken: string) {
  const response = await apiFetch('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  })

  let data: any = null
  try {
    console.log('logoutSingleDevice - refreshToken:', refreshToken)
    data = await response.json()
    console.log('logoutSingleDevice - data:', data)
  } catch {
    data = null
  }

  return { response, data }
}

async function logoutEverywhere() {
  const response = await apiFetch('/auth/logout-everywhere', {
    method: 'POST',
  })

  let data: any = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  return { response, data }
}

// ----- Component -------------------------------------------------------------

const LogoutPage: React.FC = () => {
  const [singleStatus, setSingleStatus] = useState<StatusState>({ type: '', message: '' })
  const [singleLoading, setSingleLoading] = useState(false)

  const [everywhereStatus, setEverywhereStatus] = useState<StatusState>({ type: '', message: '' })
  const [everywhereLoading, setEverywhereLoading] = useState(false)

  // ----- Handlers -----------------------------------------------------------
  
  const handleSingleLogout = async () => {
    setSingleStatus({ type: '', message: '' })
    setSingleLoading(true)

    try {
      const refreshToken = getRefreshToken()
      console.log('---- handleSingleLogout, refreshToken:', refreshToken)
      if (!refreshToken) {
        setSingleStatus({
          type: 'error',
          message: 'No refresh token found. You are not logged in.',
        })
        return
      }

      const { response, data } = await logoutSingleDevice(refreshToken)
      console.log('Logout response:', JSON.stringify({ status: response.status, data }, null, 2))

      if (response.ok) {
        console.log('----- response.ok')
        //clearTokens()
        setSingleStatus({
          type: 'success',
          message: data?.message || 'Logged out successfully.',
        })
      } else {
        const errorMessage =
          data?.error_msg || data?.description || data?.detail || data?.message ||
          `Request failed with status ${response.status}`
        setSingleStatus({
          type: 'error',
          message: `Error ${response.status}: ${errorMessage}`,
        })
      }
    } catch (error) {
      console.error('Network error:', error)
      setSingleStatus({
        type: 'error',
        message: 'Network error – unable to reach the backend.',
      })
    } finally {
      setSingleLoading(false)
    }
  }

  const handleLogoutEverywhere = async () => {
    setEverywhereStatus({ type: '', message: '' })
    setEverywhereLoading(true)

    try {
      const { response, data } = await logoutEverywhere()
      console.log('Logout everywhere response:', JSON.stringify({ status: response.status, data }, null, 2))

      if (response.ok) {
        clearTokens()
        setEverywhereStatus({
          type: 'success',
          message: data?.message || 'Logged out from all devices.',
        })
      } else {
        const errorMessage =
          data?.error_msg || data?.description || data?.detail || data?.message ||
          `Request failed with status ${response.status}`
        setEverywhereStatus({
          type: 'error',
          message: `Error ${response.status}: ${errorMessage}`,
        })
      }
    } catch (error) {
      console.error('Network error:', error)
      setEverywhereStatus({
        type: 'error',
        message: 'Network error – unable to reach the backend.',
      })
    } finally {
      setEverywhereLoading(false)
    }
  }

  // ----- Render -------------------------------------------------------------
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-4xl font-bold text-olive-800 mb-2">Log Out</h1>
      <p className="text-lg text-olive-600 mb-8">
        Choose how you want to end your session.
      </p>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ----- SINGLE DEVICE LOGOUT ----- */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-olive-800 mb-2">Log Out</h2>
          <p className="text-sm text-olive-600 mb-6 flex-grow">
            End your session on this device only. The refresh token stored
            for this session will be revoked.
          </p>

          <button
            type="button"
            onClick={handleSingleLogout}
            disabled={singleLoading}
            className="w-full bg-olive-700 hover:bg-olive-800 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {singleLoading ? 'Logging out...' : 'Log Out'}
          </button>

          {singleStatus.message && (
            <div
              className={`mt-4 p-3 rounded-md text-sm ${singleStatus.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : singleStatus.type === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
            >
              {singleStatus.message}
            </div>
          )}
        </div>

        {/* ----- LOGOUT EVERYWHERE ----- */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-olive-800 mb-2">Log Out Everywhere</h2>
          <p className="text-sm text-olive-600 mb-6 flex-grow">
            End your session on all devices. All active refresh tokens
            associated with your account will be revoked.
          </p>

          <button
            type="button"
            onClick={handleLogoutEverywhere}
            disabled={everywhereLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {everywhereLoading ? 'Logging out...' : 'Log Out Everywhere'}
          </button>

          {everywhereStatus.message && (
            <div
              className={`mt-4 p-3 rounded-md text-sm ${everywhereStatus.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : everywhereStatus.type === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
            >
              {everywhereStatus.message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LogoutPage
