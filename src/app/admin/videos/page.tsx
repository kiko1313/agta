import { Metadata } from 'next';
import { connectDB } from "@/lib/mongodb";
import Content from '@/models/Content';
import ContentList from '@/components/ContentList';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Admin Videos - AGTALIST',
};

async function getVideos() {
    await connectDB();
    const videos = await Content.find({ type: 'video' }).sort({ createdAt: -1 }).limit(200).lean();
    return JSON.parse(JSON.stringify(videos));
}

export default async function AdminVideosPage() {
    let videos: any[] = [];
    let error: string | null = null;

    try {
        videos = await getVideos();
    } catch (e: any) {
        console.error('Admin videos fetch failed:', e);
        error = 'Failed to load videos. Please check database connection.';
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Videos</h1>
                <p className="text-gray-400 mt-1">Manage uploaded and linked videos.</p>
            </div>
            {error ? (
                <div className="p-4 bg-red-900/30 border border-red-800 text-red-200 rounded-lg">
                    {error}
                </div>
            ) : (
                <ContentList initialContent={videos} />
            )}
        </div>
    );
}
