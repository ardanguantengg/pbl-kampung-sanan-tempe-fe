
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = [
  '/dashboard',
  '/toko',
  '/produk',
  '/hampers',
  '/audit-log',
  '/analytics',
  '/ai-insight',
  '/pengetahuan',
]

export function proxy(request: NextRequest) {
  const token = request.cookies.get('sanan_token')?.value
  const { pathname } = request.nextUrl

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/toko/:path*',
    '/produk/:path*',
    '/hampers/:path*',
    '/audit-log/:path*',
    '/analytics/:path*',
    '/ai-insight/:path*',
    '/pengetahuan/:path*',
    '/login',
  ],
}
