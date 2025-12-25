import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import Admin from '@/models/Admin';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        // 1. Check against Environment Variables FIRST (No DB required)
        // This ensures the main admin can login even if DB is down.
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            // Create cookie
            const token = signToken({ username });
            const response = NextResponse.json({ success: true });
            response.cookies.set('admin_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });
            return response;
        }

        // 2. Only connect to DB if we need to check other admins
        try {
            await connectDB();
            const admin = await Admin.findOne({ username });
            if (!admin) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            const isMatch = await bcrypt.compare(password, admin.password as string);
            if (!isMatch) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            const token = signToken({ username: admin.username, id: admin._id.toString() });
            const response = NextResponse.json({ success: true });
            response.cookies.set('admin_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });
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
