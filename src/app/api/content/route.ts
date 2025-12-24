import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import { isAuthenticated } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        if (!await isAuthenticated()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
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
