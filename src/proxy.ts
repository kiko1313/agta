import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
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
  matcher: ['/admin/:path*'],
};
