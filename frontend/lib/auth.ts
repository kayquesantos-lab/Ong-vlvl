import api from './api'
import Cookies from 'js-cookie'

export async function login(username: string, password: string) {
  try {
    const { data } = await api.post('/token/', { username, password })
    Cookies.set('access_token', data.access, { sameSite: 'strict' })
    Cookies.set('refresh_token', data.refresh, { sameSite: 'strict' })
  } catch (error: any) {
    const status = error.response?.status
    const code = error.response?.data?.code

    if (status === 403 && code === 'pending_approval') {
      throw new Error('Sua conta ainda aguarda aprovação do administrador.')
    }
    if (status === 401 || status === 400) {
      throw new Error('Usuário ou senha inválidos.')
    }
    if (!error.response) {
      throw new Error('Sem conexão com o servidor. Verifique sua internet.')
    }
    throw new Error('Erro inesperado. Tente novamente.')
  }
}

export function logout() {
  Cookies.remove('access_token')
  Cookies.remove('refresh_token')
  window.location.href = '/login'
}

export function isAuthenticated() {
  return !!Cookies.get('access_token')
}