// ----- Token storage (in‑memory for access, sessionStorage for refresh) -----

let accessToken: string | null = null

export function setTokens(access: string, refresh: string) {
  accessToken = access
  // Refresh token: sessionStorage survives navigation, cleared on tab close.
  // For higher security, the backend should set an httpOnly cookie instead.
  sessionStorage.setItem('refresh_token', refresh)
}

export function getAccessToken() {
  return accessToken
}

export function getRefreshToken() {
  return sessionStorage.getItem('refresh_token')
}

export function clearTokens() {
  accessToken = null
  sessionStorage.removeItem('refresh_token')
}

// ----- Fetch wrapper that attaches the access token -------------------------

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const response = await fetch(`http://localhost:8080/api/v1${path}`, {
    ...options,
    headers,
  })

  // Auto‑refresh on 401 (access token expired)
  if (response.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      // Retry the original request with the new access token
      headers['Authorization'] = `Bearer ${accessToken}`
      return fetch(`http://localhost:8080/api/v1${path}`, { ...options, headers })
    }
  }

  return response
}

// ----- Silent refresh -------------------------------------------------------

async function refreshAccessToken(): Promise<boolean> {
  const refresh = getRefreshToken()
  if (!refresh) return false

  try {
    const response = await fetch('http://localhost:8080/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    })

    if (!response.ok) {
      clearTokens()
      return false
    }

    const data = await response.json()
    setTokens(data.access_token, data.refresh_token)
    return true
  } catch {
    clearTokens()
    return false
  }
}
