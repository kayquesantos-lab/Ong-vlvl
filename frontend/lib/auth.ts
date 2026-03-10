import api from './api'
import Cookies from 'js-cookie'

export async function login(username: string, password: string) {
  const { data } = await api.post('/token/', { username, password })
  Cookies.set('access_token', data.access, { sameSite: 'strict' })
  Cookies.set('refresh_token', data.refresh, { sameSite: 'strict' })
}

export function logout() {
  Cookies.remove('access_token')
  Cookies.remove('refresh_token')
  window.location.href = '/login'
}

export function isAuthenticated() {
  return !!Cookies.get('access_token')
}