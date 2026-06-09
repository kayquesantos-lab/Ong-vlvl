import axios, { AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'

const ERROS_SEM_RETRY = [400, 401, 403, 404, 422]
const MAX_RETRY = 2
const AUTH_ENDPOINTS = ['/token/', '/token/refresh/', '/usuarios/cadastrar/']

interface ConfigComRetry extends AxiosRequestConfig {
  _retry?: boolean
  _retryCount?: number
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!BASE_URL && typeof window !== 'undefined') {
  console.error(
    '[API] NEXT_PUBLIC_API_URL nao definida. Configure .env.local com a URL do backend Django.'
  )
}

const api = axios.create({
  baseURL: BASE_URL || 'https://ong-vlvl-teste-production.up.railway.app/api',
})

function isAuthEndpoint(url?: string) {
  if (!url) return false
  return AUTH_ENDPOINTS.some((endpoint) => url.endsWith(endpoint))
}

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config as ConfigComRetry
    const status = error.response?.status

    // 401 nos endpoints de auth: deixa o chamador tratar (nao tenta refresh)
    if (status === 401 && isAuthEndpoint(config?.url)) {
      return Promise.reject(error)
    }

    // 401 em endpoint protegido: tenta refresh uma vez
    if (status === 401 && !config._retry) {
      const refresh = Cookies.get('refresh_token')
      if (refresh) {
        try {
          config._retry = true
          const { data } = await axios.post(`${api.defaults.baseURL}/token/refresh/`, {
            refresh,
          })
          Cookies.set('access_token', data.access, { sameSite: 'strict' })
          config.headers = { ...config.headers, Authorization: `Bearer ${data.access}` }
          return api(config)
        } catch {
          Cookies.remove('access_token')
          Cookies.remove('refresh_token')
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          return Promise.reject(error)
        }
      } else {
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    }

    // Erros do usuario: nao retry
    if (status && ERROS_SEM_RETRY.includes(status)) {
      return Promise.reject(error)
    }

    // Erros de servidor ou rede: retry com backoff
    config._retryCount = config._retryCount ?? 0
    if (config._retryCount < MAX_RETRY) {
      config._retryCount += 1
      await new Promise((resolve) => setTimeout(resolve, config._retryCount! * 1000))
      return api(config)
    }

    return Promise.reject(error)
  }
)

export default api
