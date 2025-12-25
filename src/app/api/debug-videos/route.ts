import { connectDB } from '@/lib/mongodb';
import Content from '@/models/Content';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const videos = await Content.find({ type: 'video' }).select('title url').limit(10).lean();
        return NextResponse.json({ videos });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch videos', details: error instanceof Error ? error.message : 'Unknown' }, { status: 500 });
    }
}
