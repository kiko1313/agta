import { Metadata } from 'next';
import { connectDB } from "@/lib/mongodb";
import Content from '@/models/Content';
import ContentList from '@/components/ContentList';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Admin Links - AGTALIST',
};

async function getLinks() {
    await connectDB();
    const links = await Content.find({ type: 'link' }).sort({ createdAt: -1 }).limit(200).lean();
    return JSON.parse(JSON.stringify(links));
}

export default async function AdminLinksPage() {
    const links = await getLinks();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Links</h1>
                <p className="text-gray-400 mt-1">Manage external links.</p>
            </div>
            <ContentList initialContent={links} />
        </div>
    );
}
