'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

type ContentType = 'video' | 'photo' | 'program' | 'link';

type ContentItem = {
    _id: string;
    type: ContentType;
    title: string;
    description?: string;
    url: string;
    thumbnailUrl?: string;
    category?: string;
    tags?: string[];
    fileSize?: string;
};

type FormState = {
    title: string;
    description: string;
    url: string;
    thumbnailUrl: string;
    category: string;
    tags: string;
    fileSize: string;
};

export default function AdminEditPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const id = useMemo(() => params?.id, [params]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [item, setItem] = useState<ContentItem | null>(null);
    const [form, setForm] = useState<FormState>({
        title: '',
        description: '',
        url: '',
        thumbnailUrl: '',
        category: 'General',
        tags: '',
        fileSize: '',
    });

    useEffect(() => {
        if (!id) return;

        let cancelled = false;
        setLoading(true);
        setError(null);
        setMessage(null);

        (async () => {
            try {
                const res = await fetch(`/api/content/${id}`, { method: 'GET' });
                const data = await res.json().catch(() => ({}));

                if (!res.ok || !data?.data) {
                    throw new Error(data?.error || 'Failed to load content');
                }

                const c: ContentItem = data.data;
                if (cancelled) return;

                setItem(c);
                setForm({
                    title: c.title || '',
                    description: c.description || '',
                    url: c.url || '',
                    thumbnailUrl: c.thumbnailUrl || '',
                    category: c.category || 'General',
                    tags: Array.isArray(c.tags) ? c.tags.join(', ') : '',
                    fileSize: c.fileSize || '',
                });
            } catch (e) {
                if (cancelled) return;
                setError(e instanceof Error ? e.message : 'Failed to load content');
            } finally {
                if (cancelled) return;
                setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setSaving(true);
        setMessage(null);

        try {
            const payload = {
                title: form.title,
                description: form.description,
                url: form.url,
                thumbnailUrl: form.thumbnailUrl,
                category: form.category,
                fileSize: item?.type === 'program' ? form.fileSize : undefined,
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            };

            const res = await fetch(`/api/content/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data?.error || 'Failed to save');
            }

            setMessage({ type: 'success', text: 'Saved successfully.' });
            router.refresh();
        } catch (e) {
            setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Failed to save' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Edit Content</h1>
                    <p className="text-gray-400 mt-1">
                        {item ? `${item.type.toUpperCase()} • ${item._id}` : 'Update your item details.'}
                    </p>
                </div>

                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-red-900/30 border border-red-800 text-red-200 rounded-lg"
                    >
                        {error}
                    </motion.div>
                )}

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                                ? 'bg-green-900/30 text-green-400 border border-green-800'
                                : 'bg-red-900/30 text-red-400 border border-red-800'
                            }`}
                    >
                        {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span>{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl text-gray-400">Loading...</div>
            ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                    <form onSubmit={onSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={form.title}
                                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Category</label>
                                <input
                                    type="text"
                                    value={form.category}
                                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none h-32"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">URL</label>
                                <input
                                    type="url"
                                    required
                                    value={form.url}
                                    onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                                />
                            </div>

                            {(item?.type === 'video' || item?.type === 'program' || item?.type === 'link') && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Thumbnail URL</label>
                                    <input
                                        type="url"
                                        value={form.thumbnailUrl}
                                        onChange={(e) => setForm(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                                    />
                                </div>
                            )}
                        </div>

                        {item?.type === 'program' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">File Size</label>
                                <input
                                    type="text"
                                    value={form.fileSize}
                                    onChange={(e) => setForm(prev => ({ ...prev, fileSize: e.target.value }))}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                                    placeholder="e.g. 150 MB"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Tags (comma separated)</label>
                            <input
                                type="text"
                                value={form.tags}
                                onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </div>

                        {/* Preview Section */}
                        {(form.url || form.thumbnailUrl) && (
                            <div className="p-4 bg-gray-950/50 rounded-xl border border-gray-800">
                                <h3 className="text-sm font-medium text-gray-400 mb-4">Preview</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {form.thumbnailUrl && (
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-500">Thumbnail</p>
                                            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 border border-gray-800">
                                                <img 
                                                    src={form.thumbnailUrl} 
                                                    alt="Thumbnail preview" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {item?.type === 'video' && form.url && (
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-500">Video</p>
                                            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 border border-gray-800">
                                                <video 
                                                    src={form.url} 
                                                    controls 
                                                    className="w-full h-full"
                                                    onError={(e) => console.error("Video preview error:", e)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {item?.type === 'photo' && form.url && (
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-500">Image</p>
                                            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 border border-gray-800">
                                                <img 
                                                    src={form.url} 
                                                    alt="Content preview" 
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
