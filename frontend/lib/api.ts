// ─── Helpers de cookie (browser) ─────────────────────────────────────────────

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.split('=')[1]) : undefined
}

function setCookie(name: string, value: string, days = 1): void {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`
}

function removeCookie(name: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict`
}

// ─── Configuração ─────────────────────────────────────────────────────────────

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://ong-vlvl-production-ca1e.up.railway.app/api'

const ERROS_SEM_RETRY = [400, 401, 403, 404, 422]
const MAX_RETRY = 2
const AUTH_ENDPOINTS = ['/token/', '/token/refresh/', '/usuarios/cadastrar/']

function isAuthEndpoint(url: string): boolean {
  return AUTH_ENDPOINTS.some((endpoint) => url.endsWith(endpoint))
}

function redirectToLogin(): void {
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

// ─── Tipos internos ───────────────────────────────────────────────────────────

interface RequestOptions extends RequestInit {
  _retryCount?: number
  _retry?: boolean
}

// ─── Fetch com autenticação, refresh e retry ──────────────────────────────────

async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`
  const { _retryCount = 0, _retry = false, ...fetchOptions } = options

  // Injeta token de acesso
  const token = getCookie('access_token')
  const headers = new Headers(fetchOptions.headers)
  headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(url, { ...fetchOptions, headers })

  // Sucesso
  if (res.ok) {
    // 204 No Content não tem body
    if (res.status === 204) return undefined as T
    return res.json() as Promise<T>
  }

  const status = res.status

  // 401 em endpoint de auth: deixa o chamador tratar
  if (status === 401 && isAuthEndpoint(path)) {
    const errorData = await res.json().catch(() => ({}))
    throw { status, data: errorData }
  }

  // 401 em endpoint protegido: tenta refresh uma vez
  if (status === 401 && !_retry) {
    const refresh = getCookie('refresh_token')
    if (refresh) {
      try {
        const refreshRes = await fetch(`${BASE_URL}/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh }),
        })
        if (!refreshRes.ok) throw new Error('Refresh falhou')
        const { access } = await refreshRes.json()
        setCookie('access_token', access)

        // Tenta a requisição original novamente com o novo token
        return apiFetch<T>(path, { ...options, _retry: true })
      } catch {
        removeCookie('access_token')
        removeCookie('refresh_token')
        redirectToLogin()
        throw { status: 401, data: {} }
      }
    } else {
      redirectToLogin()
      throw { status: 401, data: {} }
    }
  }

  // Erros do usuário: não faz retry
  if (ERROS_SEM_RETRY.includes(status)) {
    const errorData = await res.json().catch(() => ({}))
    throw { status, data: errorData }
  }

  // Erros de servidor ou rede: retry com backoff
  if (_retryCount < MAX_RETRY) {
    await new Promise((resolve) =>
      setTimeout(resolve, (_retryCount + 1) * 1000)
    )
    return apiFetch<T>(path, { ...options, _retryCount: _retryCount + 1 })
  }

  const errorData = await res.json().catch(() => ({}))
  throw { status, data: errorData }
}

// ─── Interface pública ────────────────────────────────────────────────────────

const api = {
  get<T = unknown>(path: string, options?: RequestOptions) {
    return apiFetch<T>(path, { ...options, method: 'GET' })
  },

  post<T = unknown>(path: string, body?: unknown, options?: RequestOptions) {
    return apiFetch<T>(path, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  },

  put<T = unknown>(path: string, body?: unknown, options?: RequestOptions) {
    return apiFetch<T>(path, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  },

  patch<T = unknown>(path: string, body?: unknown, options?: RequestOptions) {
    return apiFetch<T>(path, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  },

  delete<T = unknown>(path: string, options?: RequestOptions) {
    return apiFetch<T>(path, { ...options, method: 'DELETE' })
  },

  // Upload de arquivo (multipart/form-data) — não seta Content-Type,
  // o browser define automaticamente com o boundary correto
  upload<T = unknown>(
    path: string,
    formData: FormData,
    options?: RequestOptions
  ) {
    const { _retryCount = 0, _retry = false, ...fetchOptions } = options ?? {}
    const token = getCookie('access_token')
    const headers = new Headers(fetchOptions.headers)
    if (token) headers.set('Authorization', `Bearer ${token}`)
    // NÃO seta Content-Type aqui — FormData precisa do boundary automático
    return apiFetch<T>(path, {
      ...fetchOptions,
      _retryCount,
      _retry,
      method: 'POST',
      headers,
      body: formData,
    })
  },
}

export { getCookie, setCookie, removeCookie }
export default api
