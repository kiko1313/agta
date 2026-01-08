import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import Content from '@/models/Content';
import { isAuthenticated } from '@/lib/auth';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const content = await Content.findById(id).lean();

        if (!content) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: content });
    } catch (error: any) {
        console.error('Fetch content error:', error);
        return NextResponse.json({ error: error.message || 'Error fetching content' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!await isAuthenticated()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        const deletedContent = await Content.findByIdAndDelete(id);

        if (!deletedContent) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }

        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        console.error('Delete content error:', error);
        return NextResponse.json({ error: error.message || 'Error deleting content' }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!await isAuthenticated()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        const body = await req.json();

        const updatedContent = await Content.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updatedContent) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedContent });
    } catch (error: any) {
        console.error('Update content error:', error);
        return NextResponse.json({ error: error.message || 'Error updating content' }, { status: 500 });
    }
}
