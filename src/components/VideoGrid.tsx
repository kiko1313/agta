"use client";

import { IContent } from "@/models/Content";
import VideoCard from "./VideoCard";

interface VideoGridProps {
    videos: IContent[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
    if (!videos || videos.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500">
                <p>No videos found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-10 gap-x-4">
            {videos.map((video) => (
                // Mongoose _id is typically an object, format needed or cast to string
                <VideoCard key={String(video._id)} video={video} />
            ))}
        </div>
    );
}
