'use client';

import { useState } from 'react';
import { Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ContentItem {
    _id: string;
    type: 'video' | 'photo' | 'program' | 'link';
    title: string;
    description?: string;
    url: string;
    thumbnailUrl?: string;
    category?: string;
    views: number;
    createdAt: string;
}

interface ContentListProps {
    initialContent: ContentItem[];
}

export default function ContentList({ initialContent }: ContentListProps) {
    const router = useRouter();
    const [content, setContent] = useState<ContentItem[]>(initialContent);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleDelete = async (id: string) => {
        setIsDeleting(true);
        setMessage(null);

        try {
            const res = await fetch(`/api/content/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Failed to delete content');
            }

            setContent(content.filter(item => item._id !== id));
            setMessage({ type: 'success', text: 'Content deleted successfully!' });
            setDeleteConfirm(null);
            router.refresh();
        } catch (error) {
            setMessage({ type: 'error', text: 'Error deleting content. Please try again.' });
        } finally {
            setIsDeleting(false);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'video': return 'text-red-500 bg-red-900/20 border-red-800';
            case 'photo': return 'text-blue-500 bg-blue-900/20 border-blue-800';
            case 'program': return 'text-green-500 bg-green-900/20 border-green-800';
            case 'link': return 'text-yellow-500 bg-yellow-900/20 border-yellow-800';
            default: return 'text-gray-500 bg-gray-900/20 border-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 rounded-lg ${message.type === 'success'
                                ? 'bg-green-900/30 text-green-400 border border-green-800'
                                : 'bg-red-900/30 text-red-400 border border-red-800'
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {content.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No content found. Start by uploading your first item!
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {content.map((item) => (
                        <motion.div
                            key={item._id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-xs font-mono px-2 py-1 rounded border ${getTypeColor(item.type)}`}>
                                            {item.type.toUpperCase()}
                                        </span>
                                        {item.category && (
                                            <span className="text-xs text-gray-500 bg-gray-950 px-2 py-1 rounded">
                                                {item.category}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg text-white mb-1 truncate">{item.title}</h3>
                                    {item.description && (
                                        <p className="text-sm text-gray-400 line-clamp-2 mb-2">{item.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>{item.views} views</span>
                                        <span>•</span>
                                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 hover:text-white transition-colors"
                                        >
                                            View <ExternalLink size={12} />
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {deleteConfirm === item._id ? (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                disabled={isDeleting}
                                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-800 text-white text-sm rounded-lg transition-colors"
                                            >
                                                {isDeleting ? 'Deleting...' : 'Confirm'}
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                disabled={isDeleting}
                                                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirm(item._id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete content"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
