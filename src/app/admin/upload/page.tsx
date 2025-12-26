'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FileVideo, Image as ImageIcon, Link as LinkIcon, Download, UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import { UploadButton } from '@/utils/uploadthing';

function getYouTubeId(url: string): string | null {
    try {
        const raw = url.trim();
        const normalized = raw.startsWith('http') ? raw : `https://${raw}`;
        const u = new URL(normalized);

        if (u.hostname.includes('youtu.be')) {
            const id = u.pathname.split('/').filter(Boolean)[0];
            return id || null;
        }

        if (u.hostname.includes('youtube.com')) {
            if (u.pathname.startsWith('/watch')) {
                return u.searchParams.get('v');
            }
            if (u.pathname.startsWith('/shorts/')) {
                const id = u.pathname.split('/shorts/')[1]?.split('/')[0];
                return id || null;
            }
            if (u.pathname.startsWith('/embed/')) {
                const id = u.pathname.split('/embed/')[1]?.split('/')[0];
                return id || null;
            }
        }

        return null;
    } catch {
        return null;
    }
}

async function generateVideoThumbnailDataUrlFromRemote(url: string): Promise<string | null> {
    try {
        const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
        const video = document.createElement('video');
        video.src = normalized;
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.crossOrigin = 'anonymous';

        await new Promise<void>((resolve, reject) => {
            video.addEventListener('loadeddata', () => resolve(), { once: true });
            video.addEventListener('error', () => reject(new Error('Failed to load video for thumbnail')), { once: true });
        });

        const targetTime = Math.min(0.2, Number.isFinite(video.duration) ? Math.max(0, video.duration - 0.1) : 0.2);
        if (targetTime > 0) {
            video.currentTime = targetTime;
            await new Promise<void>((resolve) => {
                video.addEventListener('seeked', () => resolve(), { once: true });
            });
        }

        const canvas = document.createElement('canvas');
        const width = Math.min(1280, video.videoWidth || 1280);
        const height = Math.round(width / (video.videoWidth && video.videoHeight ? (video.videoWidth / video.videoHeight) : (16 / 9)));
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        ctx.drawImage(video, 0, 0, width, height);

        return canvas.toDataURL('image/jpeg', 0.85);
    } catch {
        return null;
    }
}

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
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || 'Failed to create content');
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
                                type="text"
                                value={formData.url}
                                onChange={(e) => {
                                    const url = e.target.value;
                                    setFormData(prev => {
                                        const next = { ...prev, url };
                                        if (type === 'video') {
                                            const yt = getYouTubeId(url);
                                            if (yt && !next.thumbnailUrl) {
                                                next.thumbnailUrl = `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`;
                                            }
                                        }
                                        return next;
                                    });
                                }}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="https://..."
                            />
                            <div className="mt-3">
                                <UploadButton
                                    endpoint={
                                        type === 'video' ? 'videoUploader' :
                                            type === 'photo' ? 'imageUploader' :
                                                'fileUploader'
                                    }
                                    onClientUploadComplete={(res) => {
                                        if (res?.[0]?.url) {
                                            const uploadedUrl = res[0].url;
                                            const fileName = res[0].name || uploadedUrl;
                                            
                                            // Auto-detect content type from file extension
                                            const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileName);
                                            const isVideo = /\.(mp4|webm|mov|avi|mkv|m4v)$/i.test(fileName);
                                            const isProgram = /\.(exe|dmg|zip|rar|7z|msi|pkg|deb|rpm|apk)$/i.test(fileName);
                                            
                                            // Auto-switch type based on uploaded file
                                            if (isImage && type !== 'photo') {
                                                setType('photo');
                                            } else if (isVideo && type !== 'video') {
                                                setType('video');
                                            } else if (isProgram && type !== 'program') {
                                                setType('program');
                                            }
                                            
                                            setFormData(prev => ({ ...prev, url: uploadedUrl }));

                                            if (type === 'video') {
                                                const yt = getYouTubeId(uploadedUrl);
                                                if (yt) {
                                                    setFormData(prev => ({ ...prev, thumbnailUrl: prev.thumbnailUrl || `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` }));
                                                } else {
                                                    if (!formData.thumbnailUrl) {
                                                        generateVideoThumbnailDataUrlFromRemote(uploadedUrl)
                                                            .then((thumb) => {
                                                                if (thumb) {
                                                                    setFormData(prev => ({ ...prev, thumbnailUrl: prev.thumbnailUrl || thumb }));
                                                                }
                                                            })
                                                            .catch(() => { });
                                                    }
                                                }
                                            }

                                            setMessage({ type: 'success', text: 'File uploaded successfully!' });
                                        }
                                        setLoading(false);
                                    }}
                                    onUploadError={(error: Error) => {
                                        setMessage({ type: 'error', text: `Upload failed: ${error.message}` });
                                        setLoading(false);
                                    }}
                                    onUploadBegin={() => {
                                        setLoading(true);
                                        setMessage({ type: 'success', text: 'Uploading file...' });
                                    }}
                                />
                                <p className="text-xs text-gray-500 mt-1">Or paste a URL above</p>
                            </div>
                        </div>

                        {(type === 'video' || type === 'program' || type === 'link') && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Thumbnail URL</label>
                                <input
                                    type="text"
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
