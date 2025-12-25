'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FileVideo, Image as ImageIcon, Link as LinkIcon, Download, UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

function UploadForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const defaultType = searchParams.get('type') || 'video';

    const [type, setType] = useState(defaultType);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
        thumbnailUrl: '',
        category: 'General',
        tags: '',
        fileSize: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const payload = {
                ...formData,
                type,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            };

            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error('Failed to create content');
            }

            setMessage({ type: 'success', text: 'Content uploaded successfully!' });
            setFormData({ title: '', description: '', url: '', thumbnailUrl: '', category: 'General', tags: '', fileSize: '' });
            router.refresh();
        } catch (error) {
            setMessage({ type: 'error', text: 'Error uploading content. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'video', label: 'Video', icon: FileVideo },
        { id: 'photo', label: 'Photo', icon: ImageIcon },
        { id: 'program', label: 'Program', icon: Download },
        { id: 'link', label: 'Link', icon: LinkIcon },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Upload Content</h1>
                <p className="text-gray-400">Add new items to your platform</p>
            </div>

            {/* Type Selection */}
            <div className="flex flex-wrap gap-4 mb-8">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = type === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setType(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                                : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                                }`}
                        >
                            <Icon size={18} />
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="Content Title"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Category</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="e.g. Gaming, Tech"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none h-32"
                            placeholder="Describe your content..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">
                                {type === 'link' ? 'Destination URL' : 'Content URL / File URL'}
                            </label>
                            <input
                                type="url"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="https://..."
                            />
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500">Paste a URL above, or upload from your PC:</p>
                                <input
                                    type="file"
                                    accept={type === 'video' ? 'video/*' : type === 'photo' ? 'image/*' : '.pdf,.zip,.exe'}
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        setLoading(true);
                                        setMessage({ type: 'success', text: 'Uploading file...' });

                                        try {
                                            const formData = new FormData();
                                            formData.append('file', file);

                                            const res = await fetch('/api/upload', {
                                                method: 'POST',
                                                body: formData,
                                            });

                                            if (!res.ok) {
                                                const errorData = await res.json();
                                                throw new Error(errorData.details || 'Upload failed');
                                            }

                                            const data = await res.json();
                                            if (data.url) {
                                                setFormData(prev => ({ ...prev, url: data.url }));
                                                setMessage({ type: 'success', text: 'File uploaded successfully!' });
                                            }
                                        } catch (error) {
                                            setMessage({ type: 'error', text: `Upload failed: ${error instanceof Error ? error.message : 'Please try again'}` });
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                                />
                            </div>
                        </div>

                        {(type === 'video' || type === 'program' || type === 'link') && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Thumbnail URL</label>
                                <input
                                    type="url"
                                    value={formData.thumbnailUrl}
                                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                                    placeholder="https://.../image.jpg"
                                />
                            </div>
                        )}
                    </div>

                    {type === 'program' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">File Size</label>
                            <input
                                type="text"
                                value={formData.fileSize}
                                onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="e.g. 150 MB"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Tags (comma separated)</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                            placeholder="action, tutorial, funny"
                        />
                    </div>

                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'
                                    }`}
                            >
                                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                <span>{message.text}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? 'Uploading...' : (
                            <>
                                <UploadCloud size={20} />
                                <span>Upload Content</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function UploadPage() {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <UploadForm />
        </Suspense>
    )
}
