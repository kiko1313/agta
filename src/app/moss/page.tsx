import { Metadata } from 'next';
import { ExternalLink, Play } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Veo 3.1 + NanoBanana - AGTALIST',
    description: 'Experience Veo 3.1 + NanoBanana for free. Click to visit the official link!',
    openGraph: {
        title: 'Veo 3.1 + NanoBanana - AGTALIST',
        description: 'Watch the latest featured content. Click here for more!',
        url: 'https://www.agtalist.info/moss',
        siteName: 'AGTALIST',
        images: [
            {
                url: '/images/moss_thumb.jpg',
                width: 1200,
                height: 675,
                alt: 'Veo 3.1 + NanoBanana',
            },
        ],
        type: 'video.other',
    },
};

export default function MossLanding() {
    const videoUrl = "https://files.catbox.moe/43moss.mp4";
    const targetUrl = "https://otieu.com/4/10349575";
    const thumbUrl = "/images/moss_thumb.jpg";

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full space-y-6 text-center">
                {/* Header */}
                <div className="space-y-2 animate-in fade-in duration-1000">
                    <div className="flex justify-center">
                        <div className="p-3 bg-blue-600 rounded-full shadow-lg shadow-blue-900/30">
                            <Play size={24} className="text-white fill-current" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight uppercase tracking-[0.1em]">Featured Video</h1>
                    <p className="text-gray-400 text-sm italic">Exclusive Content by AGTALIST</p>
                </div>

                {/* Video Player */}
                <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl animate-in zoom-in duration-700 bg-gray-900">
                    <video
                        className="absolute inset-0 w-full h-full object-cover"
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster={thumbUrl}
                    >
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* CTA Button */}
                <div className="space-y-4 pt-4 animate-in slide-in-from-bottom-4 duration-1000">
                    <p className="text-gray-300 text-sm">
                        Click the button below to visit the official link and see more!
                    </p>
                    <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-blue-900/20"
                    >
                        Visit Official Link <ExternalLink size={20} />
                    </a>
                </div>

                {/* Footer */}
                <div className="pt-8 opacity-50 text-[10px] uppercase tracking-[0.2em] font-medium">
                    Powered by AGTALIST 2026
                </div>
            </div>
        </div>
    );
}
