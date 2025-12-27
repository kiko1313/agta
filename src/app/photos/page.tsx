import { connectDB } from "@/lib/mongodb";
import Content from '@/models/Content';
import { Metadata } from 'next';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: 'Photos - AGTALIST',
    description: 'Inspiration gallery.',
};

async function getPhotos() {
    await connectDB();
    const photos = await Content.find({ type: 'photo' }).sort({ createdAt: -1 }).limit(50).lean();
    return photos;
}

export default async function PhotosPage() {
    const photos = await getPhotos();

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-7xl mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
                        Photo Gallery
                    </h1>
                    <p className="text-gray-400">Visual inspiration for your next project.</p>
                </div>

                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {photos.map((photo: any) => (
                        <a
                            key={photo._id}
                            href={photo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="break-inside-avoid relative group rounded-xl overflow-hidden block"
                            aria-label={photo.title}
                        >
                            <img
                                src={photo.url}
                                alt={photo.title}
                                className="w-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white font-medium px-4 text-center">{photo.title}</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
