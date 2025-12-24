import { FileVideo, Image as ImageIcon, Link as LinkIcon, Download } from 'lucide-react';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import Content from '@/models/Content';

async function getStats() {
    await dbConnect();
    const videos = await Content.countDocuments({ type: 'video' });
    const photos = await Content.countDocuments({ type: 'photo' });
    const programs = await Content.countDocuments({ type: 'program' });
    const links = await Content.countDocuments({ type: 'link' });
    const totalViews = await Content.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]);

    return { videos, photos, programs, links, totalViews: totalViews[0]?.total || 0 };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Dashboard Overview
                </h1>
                <p className="text-gray-400 mt-2">Welcome back, Admin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Videos" count={stats.videos} icon={<FileVideo className="text-red-500" />} />
                <StatCard title="Photos" count={stats.photos} icon={<ImageIcon className="text-blue-500" />} />
                <StatCard title="Programs" count={stats.programs} icon={<Download className="text-green-500" />} />
                <StatCard title="Links" count={stats.links} icon={<LinkIcon className="text-yellow-500" />} />
            </div>

            <div className="mt-12">
                <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/admin/upload?type=video" className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-red-500/50 transition-colors group">
                        <FileVideo className="w-8 h-8 text-gray-500 group-hover:text-red-500 mb-4 transition-colors" />
                        <h3 className="font-semibold text-lg text-white">Add New Video</h3>
                        <p className="text-gray-500 text-sm mt-1">Upload or link a video</p>
                    </Link>
                    <Link href="/admin/upload?type=photo" className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-blue-500/50 transition-colors group">
                        <ImageIcon className="w-8 h-8 text-gray-500 group-hover:text-blue-500 mb-4 transition-colors" />
                        <h3 className="font-semibold text-lg text-white">Add New Photo</h3>
                        <p className="text-gray-500 text-sm mt-1">Upload a photo</p>
                    </Link>
                    <Link href="/admin/upload?type=program" className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-green-500/50 transition-colors group">
                        <Download className="w-8 h-8 text-gray-500 group-hover:text-green-500 mb-4 transition-colors" />
                        <h3 className="font-semibold text-lg text-white">Add Program</h3>
                        <p className="text-gray-500 text-sm mt-1">Add downloadable file</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, count, icon }: { title: string, count: number, icon: React.ReactNode }) {
    return (
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 font-medium">{title}</h3>
                {icon}
            </div>
            <p className="text-3xl font-bold text-white">{count}</p>
        </div>
    );
}
