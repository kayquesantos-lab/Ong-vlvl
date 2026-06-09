import api, { getCookie, setCookie, removeCookie } from './api'

export async function login(username: string, password: string): Promise<void> {
  try {
    const data = await api.post<{ access: string; refresh: string }>('/token/', {
      username,
      password,
    })
    setCookie('access_token', data.access)
    setCookie('refresh_token', data.refresh)
  } catch (error: any) {
    const status = error?.status
    const code = error?.data?.code

    if (status === 403 && code === 'pending_approval') {
      throw new Error('Sua conta ainda aguarda aprovação do administrador.')
    }
    if (status === 401 || status === 400) {
      throw new Error('Usuário ou senha inválidos.')
    }
    if (!status) {
      throw new Error('Sem conexão com o servidor. Verifique sua internet.')
    }
    throw new Error('Erro inesperado. Tente novamente.')
  }
}

export function logout(): void {
  removeCookie('access_token')
  removeCookie('refresh_token')
  window.location.href = '/login'
}

export function isAuthenticated(): boolean {
  return !!getCookie('access_token')
}
