import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/cadastro']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get('access_token')?.value
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

  // Sem token → login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Com token na raiz → redireciona pra home real
  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/animais', request.url))
  }

  // Com token tentando acessar rota pública → home real
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/animais', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)',],
}
