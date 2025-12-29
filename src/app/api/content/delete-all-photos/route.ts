import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import Content from '@/models/Content';
import { isAuthenticated } from '@/lib/auth';

export async function DELETE(req: NextRequest) {
    try {
        if (!await isAuthenticated()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Delete all content with type 'photo'
        const result = await Content.deleteMany({ type: 'photo' });

        return NextResponse.json({ 
            success: true, 
            message: 'All photos deleted successfully',
            deletedCount: result.deletedCount 
        });
    } catch (error: any) {
        console.error('Delete all photos error:', error);
        return NextResponse.json({ 
            error: error.message || 'Error deleting photos' 
        }, { status: 500 });
    }
}
