import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import Content from '@/models/Content';
import { isAuthenticated } from '@/lib/auth';

export const revalidate = 0;

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const limitStr = searchParams.get('limit');
        const skipStr = searchParams.get('skip');

        const limit = limitStr ? Math.min(Math.max(parseInt(limitStr), 1), 100) : 50;
        const skip = skipStr ? Math.max(parseInt(skipStr), 0) : 0;

        const allowedTypes = ['video', 'photo', 'program', 'link'];
        if (type && !allowedTypes.includes(type)) {
            return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
        }

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
