// ─── Helpers de cookie (browser-safe) ────────────────────────────────────────

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.split('=')[1]) : undefined
}

function setCookie(name: string, value: string, options?: { secure?: boolean; sameSite?: 'strict' | 'lax' | 'none'; days?: number }): void {
  if (typeof document === 'undefined') return
  const days = options?.days ?? 1
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  const secure = options?.secure ? '; Secure' : ''
  const sameSite = options?.sameSite ? `; SameSite=${options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1)}` : '; SameSite=Strict'
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/${secure}${sameSite}`
}

function removeCookie(name: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict`
}

// ─── Configuração ─────────────────────────────────────────────────────────────

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://ongvlvl-production.up.railway.app/api'

const ERROS_SEM_RETRY = [400, 401, 403, 404, 422]
const MAX_RETRY = 2

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
}

interface RequestOptions extends RequestInit {
  _retryCount?: number
  _retry?: boolean
  _rawBody?: boolean // sinaliza que o body já foi serializado (ex: FormData)
}

// ─── Core fetch ───────────────────────────────────────────────────────────────

async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${path}`
  const { _retryCount = 0, _retry = false, _rawBody = false, ...fetchOptions } = options

  // Injeta token de acesso
  const token = getCookie('access_token')
  const headers = new Headers(fetchOptions.headers)
  if (!_rawBody) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const method = (fetchOptions.method ?? 'GET').toUpperCase()

  // ─── Logs de desenvolvimento ─────────────────────────────────────────────
  if (process.env.NODE_ENV === 'development') {
    if (method === 'POST') {
      if (!fetchOptions.body) {
        console.warn(`[API] POST ${path} — sem body`)
      } else {
        console.log(
          `[API] POST ${path}`,
          fetchOptions.body instanceof FormData ? '[FormData]' : fetchOptions.body
        )
      }
    }
    if (method === 'GET') {
      console.log(`[API] GET ${path}`)
    }
  }

  let res: Response
  try {
    res = await fetch(url, { ...fetchOptions, headers })
  } catch (networkError) {
    console.error('[API] Erro de rede:', networkError)
    throw { status: 0, data: {}, message: 'Sem conexão com o servidor.' }
  }

  // ─── Log de resposta ──────────────────────────────────────────────────────
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API] ${res.status} ${method} ${path}`)
  }

  // ─── Sucesso ──────────────────────────────────────────────────────────────
  if (res.ok) {
    if (res.status === 204) return { data: undefined as T }
    const data = await res.json()
    return { data }
  }

  const status = res.status
  const errorData = await res.json().catch(() => ({}))

  // ─── 401 em endpoint de auth: deixa o chamador tratar ────────────────────
  const isAuthEndpoint =
    path.endsWith('/token/') ||
    path.endsWith('/token/refresh/') ||
    path.endsWith('/usuarios/cadastrar/')

  if (status === 401 && isAuthEndpoint) {
    throw { status, data: errorData }
  }

  // ─── 401 em endpoint protegido: tenta refresh uma vez ────────────────────
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
        setCookie('access_token', access, { secure: true, sameSite: 'strict' })
        if (process.env.NODE_ENV === 'development') {
          console.log('[API] Token renovado com sucesso.')
        }
        return apiFetch<T>(path, { ...options, _retry: true })
      } catch {
        removeCookie('access_token')
        removeCookie('refresh_token')
        if (typeof window !== 'undefined') window.location.href = '/login'
        throw { status: 401, data: {} }
      }
    } else {
      if (typeof window !== 'undefined') window.location.href = '/login'
      throw { status: 401, data: {} }
    }
  }

  // ─── Erros do usuário: sem retry ─────────────────────────────────────────
  if (ERROS_SEM_RETRY.includes(status)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[API] Erro ${status} em ${method} ${path} — sem retry`)
    }
    throw { status, data: errorData }
  }

  // ─── Erros de servidor/rede: retry com backoff ───────────────────────────
  if (_retryCount < MAX_RETRY) {
    const espera = (_retryCount + 1) * 1000
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[API] Tentativa ${_retryCount + 1}/${MAX_RETRY} para ${method} ${path} em ${espera}ms`)
    }
    await new Promise((resolve) => setTimeout(resolve, espera))
    return apiFetch<T>(path, { ...options, _retryCount: _retryCount + 1 })
  }

  console.error(`[API] Falha após ${MAX_RETRY} tentativas em ${path}`)
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

  // Upload multipart/form-data — NÃO seta Content-Type (browser define o boundary)
  upload<T = unknown>(path: string, formData: FormData, options?: Omit<RequestOptions, 'body'>) {
    return apiFetch<T>(path, {
      ...options,
      method: 'POST',
      body: formData,
      _rawBody: true,
    })
  },
}

export { getCookie, setCookie, removeCookie }
export default api
