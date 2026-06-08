import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC = new Set(['/login', '/cadastro'])
const PROTECTED = ['/animais', '/saude', '/financeiro', '/usuarios']

export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname
  const hasToken = req.cookies.has('access_token')

  const isProtected = PROTECTED.some(route => p.startsWith(route))
  const isPublic = PUBLIC.has(p)

  if (!hasToken && isProtected) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (hasToken && isPublic) {
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
