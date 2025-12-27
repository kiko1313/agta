'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Video = {
  _id: string;
  title: string;
  category?: string;
  thumbnailUrl?: string;
};

type Props = {
  videos: Video[];
};

export default function VideoStripe({ videos }: Props) {
  const router = useRouter();
  const directVideo = process.env.NEXT_PUBLIC_MONETAG_DIRECT_VIDEO || process.env.NEXT_PUBLIC_MONETAG_DIRECT;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    try {
      if (directVideo) {
        window.open(directVideo, '_blank', 'noopener,noreferrer');
      }
    } catch {}
    router.push(`/video/${id}`);
  };

  return (
    <div className="flex gap-6 overflow-x-auto px-6 pb-6 scrollbar-hide snap-x">
      {videos.length === 0 && (
        <div className="w-full text-center text-gray-500 py-12">No videos yet.</div>
      )}
      {videos.map((video) => (
        <div
          key={video._id}
          onClick={(e) => handleClick(e, video._id)}
          className="min-w-[300px] md:min-w-[400px] snap-start group relative rounded-xl overflow-hidden aspect-video bg-gray-900 border border-gray-800 hover:border-red-500 transition-all shadow-lg hover:shadow-red-900/20 cursor-pointer"
          role="button"
          aria-label={video.title}
        >
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
        </div>
      ))}
    </div>
  );
}
