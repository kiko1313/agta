import { Metadata } from 'next';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
    title: 'PalmPay 2026 - Smart Savings. Smarter Payments.',
    description: 'Experience the future of finance with PalmPay. From small saves to big progress—start your journey today.',
    openGraph: {
        title: 'PalmPay 2026 - Smart Savings. Smarter Payments.',
        description: 'Experience the future of finance with PalmPay. Start your journey today.',
        images: [
            {
                url: '/images/palmpay.jpg',
                width: 800,
                height: 1200,
                alt: 'PalmPay 2026',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'PalmPay 2026 - Smart Savings. Smarter Payments.',
        description: 'Experience the future of finance with PalmPay. Start your journey today.',
        images: ['/images/palmpay.jpg'],
    },
};

export default function PalmPayLanding() {
    const targetUrl = "https://otieu.com/4/10384328";

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                        Welcome to PalmPay 2026
                    </h1>
                    <p className="text-gray-400">Smart Savings. Smarter Payments.</p>
                </div>

                {/* Clickable Image Area */}
                <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative group rounded-2xl overflow-hidden border-2 border-transparent hover:border-purple-500/50 transition-all duration-500 shadow-2xl shadow-purple-500/10"
                >
                    <img
                        src="/images/palmpay.jpg"
                        alt="PalmPay 2026"
                        className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                        <span className="text-xl font-bold text-white flex items-center justify-center gap-2">
                            Visit Site <ExternalLink size={24} />
                        </span>
                    </div>
                </a>

                {/* Call to Action */}
                <div className="space-y-6">
                    <p className="text-lg text-gray-300 leading-relaxed">
                        Your Wealth, Digitized. Experience the future of finance now.
                    </p>

                    <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-full transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(147,51,234,0.4)]"
                    >
                        Start Your Journey <ExternalLink size={20} />
                    </a>
                </div>

                {/* Footer */}
                <p className="text-xs text-gray-500 pt-8 uppercase tracking-widest">
                    Scan or Click to proceed
                </p>
            </div>

            {/* Auto-redirect script (optional, commented out to let user see the cool page first) */}
            {/* <script dangerouslySetInnerHTML={{ __html: `
        setTimeout(() => {
          window.location.href = "${targetUrl}";
        }, 3000);
      `}} /> */}
        </div>
    );
}
