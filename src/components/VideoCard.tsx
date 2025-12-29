"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { IContent } from "@/models/Content";
import { formatCompactNumber, formatTimeAgo } from "@/utils/format";

interface VideoCardProps {
    video: IContent;
}

export default function VideoCard({ video }: VideoCardProps) {
    // Fallback for missing thumbnail
    const thumbnailUrl = video.thumbnailUrl || "/api/placeholder/400/225";
    // Placeholder duration data since we don't have it in DB yet
    const duration = "12:34";

    // Format creation time
    const timeAgo = video['createdAt'] ? formatTimeAgo(video['createdAt'] as unknown as string) : "Recently";

    return (
        <Link
            href={`/video/${video._id}`}
            className="group flex flex-col gap-3 cursor-pointer"
        >
            {/* Thumbnail Container */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900 border border-[var(--card-border)] group-hover:border-gray-700 transition-all">
                {/* Image */}
                <img
                    src={thumbnailUrl}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Overlay: Duration Badge */}
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-xs font-medium rounded-md">
                    {duration}
                </div>

                {/* Hover Overlay Play Button (Subtle) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    {/* Optional: Add a play icon or just rely on the scale effect */}
                </div>
            </div>

            {/* Info Section */}
            <div className="flex gap-3 items-start px-1">
                {/* Channel Avatar (Optional: use absolute path or initial) */}
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-700 mt-0.5"></div>

                <div className="flex flex-col">
                    {/* Title */}
                    <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {video.title}
                    </h3>

                    {/* Channel Name */}
                    <div className="text-[13px] text-gray-400 mt-1 hover:text-white transition-colors">
                        Agtalist
                    </div>

                    {/* Metadata */}
                    <div className="text-[13px] text-gray-400 flex items-center">
                        <span>{formatCompactNumber(video.views || 0)} views</span>
                        <span className="mx-1">•</span>
                        <span>{timeAgo}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
