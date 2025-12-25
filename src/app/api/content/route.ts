import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import Content from '@/models/Content';
import { isAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = parseInt(searchParams.get('skip') || '0');

        const query = type ? { type } : {};
        const content = await Content.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean();

        return NextResponse.json({ success: true, data: content, count: content.length });
    } catch (error: any) {
        console.error('Fetch content error:', error);
        return NextResponse.json({ error: error.message || 'Error fetching content' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        if (!await isAuthenticated()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();

        // Basic validation
        if (!body.title || !body.url || !body.type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newContent = await Content.create(body);

        return NextResponse.json({ success: true, data: newContent });
    } catch (error: any) {
        console.error('Create content error:', error);
        return NextResponse.json({ error: error.message || 'Error creating content' }, { status: 500 });
    }
}
