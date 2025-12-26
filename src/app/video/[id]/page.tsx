import { connectDB } from "@/lib/mongodb";
import Content from '@/models/Content';

export const dynamic = "force-dynamic";
import { notFound } from 'next/navigation';
import { Download, Share2, ThumbsUp } from 'lucide-react';
import { Metadata, ResolvingMetadata } from 'next';

function normalizeUrl(url: string): string {
    const trimmed = url.trim();
    if (!trimmed) return trimmed;
    if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
    return trimmed;
}

function guessVideoMimeType(url: string): string | undefined {
    const u = url.split('?')[0]?.split('#')[0] || url;
    const ext = u.split('.').pop()?.toLowerCase();
    if (!ext) return undefined;
    if (ext === 'mp4' || ext === 'm4v') return 'video/mp4';
    if (ext === 'webm') return 'video/webm';
    if (ext === 'mov') return 'video/quicktime';
    return undefined;
}

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
    // Enhanced YouTube detection and embed URL generation
    const isYouTube = /(?:youtube\.com|youtu\.be)/i.test(video.url);

    // Helper to get embed URL (adds protocol when missing and supports shorts)
    const getEmbedUrl = (url: string) => {
        let normalized = normalizeUrl(url);

        // YouTube watch URLs
        if (normalized.includes('youtube.com/watch')) {
            const id = new URL(normalized).searchParams.get('v');
            if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
        }
        // YouTube short URLs (youtu.be)
        if (normalized.includes('youtu.be/')) {
            const id = normalized.split('youtu.be/')[1]?.split(/[?&]/)[0];
            if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
        }
        // YouTube Shorts URLs
        if (normalized.includes('youtube.com/shorts/')) {
            const id = normalized.split('shorts/')[1]?.split(/[?&]/)[0];
            if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
        }
        // Direct file URLs – ensure protocol is present
        return normalized;
    };

    const normalizedMediaUrl = normalizeUrl(video.url);
    const videoMime = guessVideoMimeType(normalizedMediaUrl);

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
                        // Check if it's an image instead of a video
                        /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(normalizedMediaUrl) ? (
                            <img src={normalizedMediaUrl} alt={video.title} className="w-full h-full object-contain" />
                        ) : (
                            <video
                                controls
                                playsInline
                                preload="metadata"
                                className="w-full h-full"
                                poster={video.thumbnailUrl}
                                crossOrigin="anonymous"
                            >
                                <source src={normalizedMediaUrl} type={videoMime} />
                                Your browser does not support the video tag.
                            </video>
                        )
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
