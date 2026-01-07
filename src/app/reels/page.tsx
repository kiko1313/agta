import { connectDB } from "@/lib/mongodb";
import Content from '@/models/Content';
import ReelPlayer from '@/components/ReelPlayer';
import { Metadata } from 'next';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'Reels - AGTALIST',
  description: 'Watch short videos on Agtalist',
};

async function getReels() {
  await connectDB();
  // Fetch videos. 
  // Ideally, filtering by aspect ratio or a specific 'Reels' category is best.
  // For now, we take 20 recent videos.
  return await Content.find({ type: 'video' }).sort({ createdAt: -1 }).limit(20).lean();
}

export default async function ReelsPage() {
  const videos = await getReels();

  return (
    <div className="fixed inset-0 bg-black text-white h-[100dvh] w-full flex flex-col items-center z-[50]">
        {/* Top Navbar mimic for immersive feel */}
        <div className="absolute top-0 left-0 right-0 z-40 flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
             <h1 className="text-lg font-bold font-mono tracking-wider drop-shadow-md pointer-events-auto">
                AGTALIST <span className="text-red-600">REELS</span>
             </h1>
             <a href="/" className="pointer-events-auto text-sm font-medium bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full transition-colors">
                Exit
             </a>
        </div>

      <div className="h-full w-full max-w-md md:max-w-lg lg:max-w-xl shadow-2xl relative bg-gray-900 border-x border-gray-800/50 overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {videos.map((video: any, index: number) => (
           <ReelWrapper key={video._id} video={video} index={index} />
        ))}
        
        {videos.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>No reels available yet.</p>
            </div>
        )}
      </div>
    </div>
  );
}

// Client component wrapper to handle intersection observer for auto-play
import React from "react";
import ReelWrapper from "@/components/ReelWrapper"; 
