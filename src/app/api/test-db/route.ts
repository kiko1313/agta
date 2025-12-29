import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            return NextResponse.json({
                status: 'error',
                message: 'MONGODB_URI is not defined in environment variables.'
            }, { status: 500 });
        }

        // Mask the password in the URI for safety when displaying it
        const maskedURI = uri.replace(/:([^@]+)@/, ':****@');

        const startTime = Date.now();
        await connectDB();
        const duration = Date.now() - startTime;
        const adminCount = await Admin.countDocuments().catch(() => -1);

        const stateInfo = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting',
        };
        const readyState = mongoose.connection.readyState;
        const stateName = stateInfo[readyState as keyof typeof stateInfo] || 'unknown';

        return NextResponse.json({
            status: 'success',
            message: 'Database connection successful!',
            details: {
                readyState: readyState,
                state: stateName,
                host: mongoose.connection.host,
                dbName: mongoose.connection.name,
                durationMs: duration,
                uriConfigured: maskedURI,
                adminCount,
                envConfigured: {
                    ADMIN_USERNAME: !!process.env.ADMIN_USERNAME,
                    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
                    COOKIE_DOMAIN: !!process.env.COOKIE_DOMAIN,
                    JWT_SECRET: !!process.env.JWT_SECRET,
                }
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: 'Database connection failed.',
            error: error.message,
            stack: error.stack,
            maskedUri: process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@') : 'undefined'
        }, { status: 500 });
    }
}
