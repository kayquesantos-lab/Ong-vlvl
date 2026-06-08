import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED = ['/animais', '/saude', '/financeiro', '/usuarios']
const PUBLIC    = ['/login', '/cadastro']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const hasToken = req.cookies.has('access_token')

  const isProtected = PROTECTED.some(r => pathname.startsWith(r))
  const isPublic    = PUBLIC.some(r => pathname.startsWith(r))

  if (isProtected && !hasToken) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isPublic && hasToken) {
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
