import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/dashboard', '/toko', '/produk', '/hampers', '/audit-log', '/analytics', '/ai-insight', '/pengetahuan']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('sanan_token')?.value
  const { pathname } = request.nextUrl

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  // Redirect ke login jika belum login dan akses halaman protected
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect ke dashboard jika sudah login dan buka /login
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
