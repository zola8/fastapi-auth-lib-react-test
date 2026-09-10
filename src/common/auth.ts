// ----- Config ----------------------------------------------------------------

const API_BASE = 'http://localhost:8080/api/v1'
const REFRESH_PATH = '/auth/refresh'

// ----- In‑memory access token ------------------------------------------------

let accessToken: string | null = null

// ----- Storage helpers -------------------------------------------------------

export function setTokens(access: string, refresh: string) {
  accessToken = access
  // Refresh token lives in sessionStorage so it survives navigation
  // but is cleared when the tab closes. Prefer an httpOnly cookie in prod.
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

// ----- Refresh (single‑flight) ----------------------------------------------

let refreshPromise: Promise<boolean> | null = null

export async function refreshAccessToken(): Promise<boolean> {
  // If a refresh is already in progress, reuse it
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const refresh = getRefreshToken()
    if (!refresh) return false

    try {
      const response = await fetch(`${API_BASE}${REFRESH_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refresh }),
      })

      if (!response.ok) {
        clearTokens()
        return false
      }

      const data = (await response.json()) as {
        access_token: string
        refresh_token: string
      }

      setTokens(data.access_token, data.refresh_token)
      return true
    } catch {
      clearTokens()
      return false
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

// ----- Bootstrap: silent re‑auth on app start -------------------------------

export async function bootstrapAuth(): Promise<boolean> {
  if (accessToken) return true              // already have one in memory
  return refreshAccessToken()               // try the stored refresh token
}

// ----- Fetch wrapper with auto‑refresh on 401 -------------------------------

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const buildHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    }
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
    return headers
  }

  // First attempt
  let response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: buildHeaders(),
  })

  // If unauthorized and we have a refresh token, try once to refresh + retry
  if (response.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: buildHeaders(),
      })
    }
  }

  return response
}
