import { Metadata } from 'next';
import { ExternalLink, Music } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Talia - A vava inouva (Music Cover)',
    description: 'Enjoy this beautiful cover of "A vava inouva" by Talia. Click to visit the official link!',
    openGraph: {
        title: 'Talia - A vava inouva (Music Cover)',
        description: 'Listen to the beautiful performance by Talia. Click here for more!',
        url: 'https://www.agtalist.info/talia',
        siteName: 'AGTALIST',
        images: [
            {
                url: 'https://img.youtube.com/vi/DnzfZgXn3E8/maxresdefault.jpg',
                width: 1280,
                height: 720,
            },
        ],
        type: 'video.other',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Talia - A vava inouva',
        description: 'Listen to the beautiful performance by Talia. Click here for more!',
        images: ['https://img.youtube.com/vi/DnzfZgXn3E8/maxresdefault.jpg'],
    },
};

export default function TaliaLanding() {
    const targetUrl = "https://otieu.com/4/10349575";

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full space-y-6 text-center">
                {/* Header */}
                <div className="space-y-2 animate-in fade-in duration-1000">
                    <div className="flex justify-center">
                        <div className="p-3 bg-red-600 rounded-full shadow-lg shadow-red-900/30">
                            <Music size={24} className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Talia - A vava inouva</h1>
                    <p className="text-gray-400 text-sm">Official Music Cover & Performance</p>
                </div>

                {/* Video Embed */}
                <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl animate-in zoom-in duration-700">
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        src="https://www.youtube.com/embed/DnzfZgXn3E8?autoplay=0&rel=0"
                        title="Talia Music Cover"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* CTA Button */}
                <div className="space-y-4 pt-4 animate-in slide-in-from-bottom-4 duration-1000">
                    <p className="text-gray-300 text-sm">
                        Check out more exclusive content and official links below:
                    </p>
                    <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-red-900/20"
                    >
                        Visit Official Link <ExternalLink size={20} />
                    </a>
                </div>

                {/* Footer */}
                <div className="pt-8 opacity-50 text-[10px] uppercase tracking-[0.2em]">
                    Powered by AGTALIST 2026
                </div>
            </div>
        </div>
    );
}
