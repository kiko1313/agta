import { Metadata } from 'next';
import { connectDB } from "@/lib/mongodb";
import Content from '@/models/Content';
import ContentList from '@/components/ContentList';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Admin Photos - AGTALIST',
};

async function getPhotos() {
    await connectDB();
    const photos = await Content.find({ type: 'photo' }).sort({ createdAt: -1 }).limit(200).lean();
    return JSON.parse(JSON.stringify(photos));
}

export default async function AdminPhotosPage() {
    const photos = await getPhotos();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Photos</h1>
                <p className="text-gray-400 mt-1">Manage uploaded photos.</p>
            </div>
            <ContentList initialContent={photos} />
        </div>
    );
}
