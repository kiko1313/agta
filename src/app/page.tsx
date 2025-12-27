import Link from 'next/link';
import { Download, ExternalLink, ArrowRight } from 'lucide-react';
import { connectDB } from "@/lib/mongodb";
import Content, { IContent } from '@/models/Content';
import { Metadata } from 'next';
import VideoStripe from '@/components/VideoStripe';
import PhotoGrid from '@/components/PhotoGrid';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'AGTALIST - Premium Content Platform',
  description: 'Exclusive videos, photos, and programs.',
};

async function getData() {
  try {
    await connectDB();
    const [videos, photos, programs, links] = await Promise.all([
      Content.find({ type: 'video' }).sort({ createdAt: -1 }).limit(10).lean(),
      Content.find({ type: 'photo' }).sort({ createdAt: -1 }).limit(20).lean(),
      Content.find({ type: 'program' }).sort({ createdAt: -1 }).limit(6).lean(),
      Content.find({ type: 'link' }).sort({ createdAt: -1 }).limit(3).lean()
    ]);

    return { videos, photos, programs, links };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    // Return empty arrays so the page doesn't crash
    return { videos: [], photos: [], programs: [], links: [] };
  }
}

export default async function Home() {
  const { videos, photos, programs, links } = await getData();

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero / Video Stripe Section */}
      <section className="py-12 border-b border-gray-900">
        <div className="px-6 mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
            Latest Videos
          </h2>
          <Link href="/videos" className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <VideoStripe videos={videos as any} />
      </section>

      {/* Programs & Links Section */}
      <section className="py-12 px-6 border-b border-gray-900 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Programs & Resources</h2>
            <Link href="/programs" className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program: any) => (
              <div key={program._id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gray-800 p-3 rounded-lg group-hover:bg-green-900/30 group-hover:text-green-400 transition-colors">
                    <Download size={24} />
                  </div>
                  <span className="text-xs font-mono text-gray-500 bg-black/50 px-2 py-1 rounded">{program.fileSize || 'N/A'}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-green-400 transition-colors">{program.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">{program.description}</p>
                <a href={program.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full py-2 bg-gray-800 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors">
                  Download Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photos Masonry Section */}
      <section className="py-12 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Gallery
          </h2>
          <Link href="/photos" className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="max-w-7xl mx-auto">
          <PhotoGrid photos={photos as any} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-900 text-center text-gray-500">
        <p>© 2025 AGTALIST. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="https://www.youtube.com/@3ackrab" target="_blank" className="hover:text-red-500 transition-colors">YouTube</a>
          <a href="https://pin.it/4KSyyBtF8" target="_blank" className="hover:text-red-500 transition-colors">Pinterest</a>
        </div>
      </footer>
    </div>
  );
}
