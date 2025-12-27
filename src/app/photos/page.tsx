import { connectDB } from "@/lib/mongodb";
import Content from '@/models/Content';
import { Metadata } from 'next';
import PhotoGrid from '@/components/PhotoGrid';

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

                <PhotoGrid photos={photos as any} />
            </div>
        </div>
    );
}
