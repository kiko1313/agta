import { Download } from 'lucide-react';
import { connectDB } from "@/lib/mongodb";
import Content from '@/models/Content';
import { Metadata } from 'next';

// Use ISR for better performance
export const revalidate = 60;

export const metadata: Metadata = {
    title: 'Programs & Files - AGTALIST',
    description: 'Essential downloads and resources.',
};

async function getPrograms() {
    try {
        await connectDB();
        const programs = await Content.find({ type: 'program' }).sort({ createdAt: -1 }).limit(50).lean();
        return JSON.parse(JSON.stringify(programs));
    } catch (error) {
        console.error('[getPrograms] Error:', error);
        return [];
    }
}

export default async function ProgramsPage() {
    const programs = await getPrograms();

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-7xl mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent mb-2">
                        Programs
                    </h1>
                    <p className="text-gray-400">Software, tools, and files.</p>
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
                            <div className="text-sm text-gray-500 font-medium mb-2 uppercase tracking-wider">{program.category}</div>
                            <p className="text-sm text-gray-400 line-clamp-3 mb-6">{program.description}</p>
                            <a href={program.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-3 bg-gray-800 hover:bg-green-600 text-white font-bold rounded-lg transition-colors gap-2">
                                <Download size={18} />
                                Download
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
