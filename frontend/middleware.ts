import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export const runtime = 'experimental-edge' // ou 'edge'

const PUBLIC_ROUTES = ['/login', '/cadastro']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get('access_token')?.value
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route)

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/animais', request.url))
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/animais', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Exclui explicitamente:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagem)
     * - favicon.ico
     * - arquivos com extensão (ex: .png, .js, .css)
     * - rotas /api/*
     */
    '/((?!_next/static|_next/image|favicon\\.ico|api/|.*\\.[^/]*$).*)',
  ],
}
