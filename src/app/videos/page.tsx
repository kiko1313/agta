import { Metadata } from 'next';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { connectDB } from "@/lib/mongodb";
import Content from '@/models/Content';

// Use ISR for better performance and reliability
export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
    title: 'Videos - AGTALIST',
    description: 'Browse our collection of premium videos.',
};

async function getVideos() {
    try {
        await connectDB();
        // Fetch up to 50 videos for now (pagination can be added later via API)
        const videos = await Content.find({ type: 'video' }).sort({ createdAt: -1 }).limit(50).lean();
        // Serialize to prevent hydration issues
        return JSON.parse(JSON.stringify(videos));
    } catch (error) {
        console.error('[getVideos] Error fetching videos:', error);
        return [];
    }
}

export default async function VideosPage() {
    const videos = await getVideos();

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-7xl mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent mb-2">
                        All Videos
                    </h1>
                    <p className="text-gray-400">Watch, learn, and download.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map((video: any) => (
                        <Link href={`/video/${video._id}`} key={video._id} className="group relative rounded-xl overflow-hidden aspect-video bg-gray-900 border border-gray-800 hover:border-red-500 transition-all shadow-lg hover:shadow-red-900/20 block">
                            <img
                                src={video.thumbnailUrl || `https://placehold.co/600x400/1a1a1a/FFF?text=${encodeURIComponent(video.title)}`}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-end">
                                <div className="bg-red-600/90 text-white w-10 h-10 rounded-full flex items-center justify-center mb-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    <Play size={20} fill="currentColor" />
                                </div>
                                <h3 className="font-bold text-lg leading-tight group-hover:text-red-400 transition-colors">{video.title}</h3>
                                <p className="text-xs text-gray-400 mt-1">{video.category} • {new Date(video.createdAt).toLocaleDateString()}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
