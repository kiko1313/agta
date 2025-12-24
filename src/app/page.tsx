import Link from 'next/link';
import { Play, Download, ExternalLink, ArrowRight } from 'lucide-react';
import { connectDB } from "@/lib/mongodb";
import Content, { IContent } from '@/models/Content';
import { Metadata } from 'next';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'AGTALIST - Premium Content Platform',
  description: 'Exclusive videos, photos, and programs.',
};

async function getData() {
  await connectDB();
  // Fetch latest 10 videos
  const videos = await Content.find({ type: 'video' }).sort({ createdAt: -1 }).limit(10).lean();
  // Fetch latest 20 photos
  const photos = await Content.find({ type: 'photo' }).sort({ createdAt: -1 }).limit(20).lean();
  // Fetch latest 6 programs
  const programs = await Content.find({ type: 'program' }).sort({ createdAt: -1 }).limit(6).lean();
  // Fetch latest 3 links
  const links = await Content.find({ type: 'link' }).sort({ createdAt: -1 }).limit(3).lean();

  return { videos, photos, programs, links };
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

        <div className="flex gap-6 overflow-x-auto px-6 pb-6 scrollbar-hide snap-x">
          {videos.length === 0 && (
            <div className="w-full text-center text-gray-500 py-12">No videos yet.</div>
          )}
          {videos.map((video: any) => (
            <Link href={`/video/${video._id}`} key={video._id} className="min-w-[300px] md:min-w-[400px] snap-start group relative rounded-xl overflow-hidden aspect-video bg-gray-900 border border-gray-800 hover:border-red-500 transition-all shadow-lg hover:shadow-red-900/20">
              {/* Placeholder for real thumbnail if empty */}
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
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{video.category}</p>
              </div>
            </Link>
          ))}
        </div>
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

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 max-w-7xl mx-auto">
          {photos.map((photo: any) => (
            <div key={photo._id} className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-zoom-in">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full object-cover hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium px-4 text-center">{photo.title}</span>
              </div>
            </div>
          ))}
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
