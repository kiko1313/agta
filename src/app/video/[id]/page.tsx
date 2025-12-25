import { connectDB } from "@/lib/mongodb";
import Content from '@/models/Content';

export const dynamic = "force-dynamic";
import { notFound } from 'next/navigation';
import { Download, Share2, ThumbsUp } from 'lucide-react';
import { Metadata, ResolvingMetadata } from 'next';

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getVideo(id: string) {
    await connectDB();
    try {
        const video = await Content.findById(id).lean();
        if (!video || video.type !== 'video') return null;

        // Increment views (fire and forget in production)
        // await Content.findByIdAndUpdate(id, { $inc: { views: 1 } });

        return video;
    } catch (e) {
        return null;
    }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const video = await getVideo(id);

    if (!video) {
        return { title: 'Video Not Found' };
    }

    return {
        title: `${video.title} - AGTALIST`,
        description: video.description || 'Watch this video on AGTALIST',
        openGraph: {
            images: [video.thumbnailUrl || ''],
        },
    };
}

export default async function VideoPage({ params }: Props) {
    const { id } = await params;
    const video = await getVideo(id);

    if (!video) return notFound();

    // Determine if it's a YouTube link or direct file
    const isYouTube = video.url.includes('youtube.com') || video.url.includes('youtu.be');

    // Helper to get embed URL
    const getEmbedUrl = (url: string) => {
        // Normalize the URL (add https:// if missing, handle youtube.com vs www.youtube.com)
        let normalizedUrl = url.trim();
        if (!normalizedUrl.startsWith('http')) {
            normalizedUrl = 'https://' + normalizedUrl;
        }

        // Handle YouTube watch URLs (with query parameters)
        if (normalizedUrl.includes('youtube.com/watch')) {
            const videoId = normalizedUrl.split('v=')[1]?.split('&')[0];
            if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        }
        // Handle YouTube Shorts (with or without www.)
        if (normalizedUrl.includes('youtube.com/shorts/')) {
            const videoId = normalizedUrl.split('shorts/')[1]?.split('?')[0]?.split('&')[0];
            if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        }
        // Handle short YouTube URLs (youtu.be)
        if (normalizedUrl.includes('youtu.be/')) {
            const videoId = normalizedUrl.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
            if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        }
        // If already an embed URL or not YouTube, return as-is
        return normalizedUrl;
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-6xl mx-auto">
                {/* Video Player Container */}
                <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 mb-6 relative">
                    {isYouTube ? (
                        <iframe
                            src={getEmbedUrl(video.url)}
                            title={video.title}
                            className="w-full h-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    ) : (
                        <video controls className="w-full h-full" poster={video.thumbnailUrl}>
                            <source src={video.url} />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>

                {/* Video Info */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">{video.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                            <span>{video.views} views</span>
                            <span>•</span>
                            <span>{new Date((video as any).createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="bg-red-900/30 text-red-500 px-2 py-0.5 rounded border border-red-900/50">{video.category}</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed max-w-2xl">{video.description}</p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <a href={video.url} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20">
                            <Download size={20} />
                            Download
                        </a>
                        <button className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-gray-300 px-6 py-3 rounded-xl font-medium transition-all border border-gray-800">
                            <Share2 size={20} />
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
