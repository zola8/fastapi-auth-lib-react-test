import React, { useState, useEffect } from 'react'
import type { StatusState, UserProfile } from './types'
import { apiFetch } from './auth'


// ----- Helpers ---------------------------------------------------------------
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function statusBadgeClass(status: string) {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-yellow-100 text-yellow-800'
    case 'blocked':
    case 'suspended':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// ----- API function ----------------------------------------------------------

async function fetchMyProfile() {
  const response = await apiFetch('/users/me', { method: 'GET' })

  // Guard against non‑JSON responses (e.g. 401 with empty body)
  let data: any = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  return { response, data }
}

// ----- Component -------------------------------------------------------------

const MyProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [status, setStatus] = useState<StatusState>({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  const loadProfile = async () => {
    setStatus({ type: '', message: '' })
    setIsLoading(true)

    try {
      const { response, data } = await fetchMyProfile()
      console.log('Profile response:', JSON.stringify({ status: response.status, data }, null, 2))

      if (response.ok && data) {
        setProfile(data as UserProfile)
        setStatus({ type: 'success', message: 'Profile loaded.' })
      } else {
        setProfile(null)
        const errorMessage =
          data?.error_msg || data?.description || data?.detail || data?.message ||
          `Request failed with status ${response.status}`
        setStatus({
          type: 'error',
          message: `Error ${response.status}: ${errorMessage}`,
        })
      }
    } catch (error) {
      console.error('Network error:', error)
      setProfile(null)
      setStatus({
        type: 'error',
        message: 'Network error – unable to reach the backend.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Auto‑load on mount
  useEffect(() => {
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-4xl font-bold text-olive-800 mb-2">My Profile</h1>
      <p className="text-lg text-olive-600 mb-8">
        Your account details from <code className="text-olive-800">GET /users/me</code>
      </p>

      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={loadProfile}
            disabled={isLoading}
            className="text-sm text-olive-700 hover:text-olive-900 underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Reload'}
          </button>
        </div>

        {isLoading && !profile && (
          <p className="text-sm text-olive-600">Loading profile…</p>
        )}

        {!isLoading && !profile && status.message && (
          <div
            className={`p-3 rounded-md text-sm ${status.type === 'success'
              ? 'bg-green-100 text-green-800'
              : status.type === 'error'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
              }`}
          >
            {status.message}
          </div>
        )}

        {profile && (
          <dl className="divide-y divide-olive-100">
            <Row label="User ID" value={profile.user_id} mono />
            <Row label="Email" value={profile.email} />
            <Row label="Username" value={profile.username} mono />

            <div className="py-3 flex justify-between items-center">
              <dt className="text-sm font-medium text-olive-700">Status</dt>
              <dd>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(
                    profile.status
                  )}`}
                >
                  {profile.status}
                </span>
              </dd>
            </div>

            <div className="py-3 flex justify-between items-start">
              <dt className="text-sm font-medium text-olive-700">Roles</dt>
              <dd className="flex flex-wrap gap-1 justify-end">
                {profile.roles?.length ? (
                  profile.roles.map((role) => (
                    <span
                      key={role}
                      className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-olive-100 text-olive-800"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-olive-500">—</span>
                )}
              </dd>
            </div>

            <Row label="Created At" value={formatDate(profile.created_at)} />
            <Row label="Updated At" value={formatDate(profile.updated_at)} />
          </dl>
        )}

        {profile && status.message && status.type === 'error' && (
          <div className="p-3 rounded-md text-sm bg-red-100 text-red-800">
            {status.message}
          </div>
        )}
      </div>
    </div>
  )
}

// ----- Small presentational row ---------------------------------------------

const Row: React.FC<{ label: string; value: string; mono?: boolean }> = ({
  label,
  value,
  mono,
}) => (
  <div className="py-3 flex justify-between items-start gap-4">
    <dt className="text-sm font-medium text-olive-700 shrink-0">{label}</dt>
    <dd
      className={`text-sm text-olive-800 text-right break-all ${mono ? 'font-mono' : ''
        }`}
    >
      {value}
    </dd>
  </div>
)

export default MyProfilePage
