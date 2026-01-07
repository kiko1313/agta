import Link from 'next/link';
import { Download, ExternalLink, ArrowRight } from 'lucide-react';
import { connectDB } from "@/lib/mongodb";
import Content, { IContent } from '@/models/Content';
import { Metadata } from 'next';
import VideoGrid from '@/components/VideoGrid';
import MgidSidebar from '@/components/MgidSidebar';


// Use ISR for better caching and reliability
export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: 'AGTALIST - Premium Content Platform',
  description: 'Exclusive videos, photos, and programs.',
};

async function getData() {
  try {
    await connectDB();
    const [videos, programs, links] = await Promise.all([
      Content.find({ type: 'video' }).sort({ createdAt: -1 }).limit(50).lean(),
      Content.find({ type: 'program' }).sort({ createdAt: -1 }).limit(6).lean(),
      Content.find({ type: 'link' }).sort({ createdAt: -1 }).limit(3).lean()
    ]);

    // Serialize MongoDB documents properly
    return { 
      videos: JSON.parse(JSON.stringify(videos)), 
      programs: JSON.parse(JSON.stringify(programs)), 
      links: JSON.parse(JSON.stringify(links)) 
    };
  } catch (error) {
    console.error("[getData] Failed to fetch data:", error);
    // Return empty arrays so the page doesn't crash
    return { videos: [], programs: [], links: [] };
  }
}

export default async function Home() {
  const { videos, programs, links } = await getData();

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Main Content Layout */}
      <div className="flex justify-center gap-6 max-w-[1800px] mx-auto pt-6 px-4 sm:px-6">

        {/* Main Feed Column */}
        <main className="flex-1 min-w-0 max-w-full space-y-12">

          {/* Hero / Video section */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
                Recommended
              </h2>
            </div>

            <VideoGrid videos={videos as any} />
          </section>

          {/* Programs & Links Section */}
          <section className="py-12 border-t border-gray-900">
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
          </section>

          {/* Footer */}
          <footer className="py-12 border-t border-gray-900 text-center text-gray-500">
            <p>© 2025 AGTALIST. All rights reserved.</p>
            <div className="mt-4">
              <Link href="/admin" className="text-xs text-gray-400 hover:text-white transition-colors">
                Admin
              </Link>
            </div>
          </footer>
        </main>

        {/* Right Sidebar (Desktop Only) */}
        <MgidSidebar />

      </div>
    </div>
  );
}
