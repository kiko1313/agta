import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const isAuth = await isAuthenticated();
    if (isAuth) {
        return NextResponse.json({ authenticated: true });
    } else {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}
