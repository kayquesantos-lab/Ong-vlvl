import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC = new Set(['/login', '/cadastro'])

export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname
  const hasToken = req.cookies.has('access_token')

  if (!hasToken && !PUBLIC.has(p)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  if (hasToken && PUBLIC.has(p)) {
    return NextResponse.redirect(new URL('/animais', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/animais/:path*',
    '/saude/:path*',
    '/financeiro/:path*',
    '/usuarios/:path*',
    '/login',
    '/cadastro',
  ],
}
