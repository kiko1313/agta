import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const response = NextResponse.json({
        success: true,
        redirectTo: '/admin/login'
    });
    const cookieOptions: any = {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    };
    if (process.env.COOKIE_DOMAIN) {
        cookieOptions.domain = process.env.COOKIE_DOMAIN;
    }
    response.cookies.set('admin_token', '', cookieOptions);
    return response;
}
