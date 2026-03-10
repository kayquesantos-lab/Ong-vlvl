import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({ baseURL: 'http://localhost:8000/api' })

api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh = Cookies.get('refresh_token')
      if (refresh) {
        try {
          const { data } = await axios.post('http://localhost:8000/api/token/refresh/', { refresh })
          Cookies.set('access_token', data.access, { secure: true, sameSite: 'strict' })
          error.config.headers.Authorization = `Bearer ${data.access}`
          return api(error.config)
        } catch {
          Cookies.remove('access_token')
          Cookies.remove('refresh_token')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api