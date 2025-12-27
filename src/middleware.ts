import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Canonicalize www -> apex for consistent cookies/localStorage
  if (host.startsWith('www.agtalist.info')) {
    url.hostname = 'agtalist.info';
    return NextResponse.redirect(url);
  }

  // Admin auth gate
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/admin/login';
  const token = request.cookies.get('admin_token')?.value || '';

  if (path.startsWith('/admin')) {
    if (isPublicPath && token) {
      return NextResponse.redirect(new URL('/admin', request.nextUrl));
    }

    if (!isPublicPath && !token) {
      return NextResponse.redirect(new URL('/admin/login', request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/',
  ],
};
