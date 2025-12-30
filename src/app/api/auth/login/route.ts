import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import Admin from '@/models/Admin';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();
        const u = typeof username === 'string' ? username.trim() : '';
        const p = typeof password === 'string' ? password.trim() : '';
        const envUser = (process.env.ADMIN_USERNAME || '').trim();
        const envPass = (process.env.ADMIN_PASSWORD || '').trim();



        // 1. Check against Environment Variables FIRST (No DB required)
        // This ensures the main admin can login even if DB is down.
        if (u && p && u === envUser && p === envPass) {
            // Create cookie
            const token = signToken({ username: u });
            const response = NextResponse.json({ success: true, token });
            const cookieOptions: any = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            };
            if (process.env.COOKIE_DOMAIN) {
                cookieOptions.domain = process.env.COOKIE_DOMAIN;
            }
            response.cookies.set('admin_token', token, cookieOptions);
            return response;
        }

        // 2. Only connect to DB if we need to check other admins
        try {
            await connectDB();
            const adminCount = await Admin.countDocuments();
            if (adminCount === 0) {
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(p, salt);
                const created = await Admin.create({ username: u, password: hashed });
                const token = signToken({ username: created.username, id: created._id.toString() });
                const response = NextResponse.json({ success: true, token, bootstrap: true });
                const cookieOptions: any = {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 7, // 1 week
                    path: '/',
                };
                if (process.env.COOKIE_DOMAIN) {
                    cookieOptions.domain = process.env.COOKIE_DOMAIN;
                }
                response.cookies.set('admin_token', token, cookieOptions);
                return response;
            }

            const admin = await Admin.findOne({ username: u });
            if (!admin) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            const isMatch = await bcrypt.compare(p, admin.password as string);
            if (!isMatch) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            const token = signToken({ username: admin.username, id: admin._id.toString() });
            const response = NextResponse.json({ success: true, token });
            const cookieOptions: any = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            };
            if (process.env.COOKIE_DOMAIN) {
                cookieOptions.domain = process.env.COOKIE_DOMAIN;
            }
            response.cookies.set('admin_token', token, cookieOptions);
            return response;
        } catch (dbError) {
            console.error('Database connection failed during login:', dbError);
            // If DB fails and they weren't the Env Var admin, we can't authenticate them.
            // But we already checked Env Var admin above.
            return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
        }

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
