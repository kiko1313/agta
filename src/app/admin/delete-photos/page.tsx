'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';

export default function DeleteAllPhotosPage() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState('');
    const [deletedCount, setDeletedCount] = useState<number | null>(null);

    const handleDeleteAllPhotos = async () => {
        if (!confirm('⚠️ Are you absolutely sure you want to delete ALL photos? This action cannot be undone!')) {
            return;
        }

        setIsDeleting(true);
        setMessage('');

        try {
            const response = await fetch('/api/content/delete-all-photos', {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`✅ Successfully deleted ${data.deletedCount} photos!`);
                setDeletedCount(data.deletedCount);
            } else {
                setMessage(`❌ Error: ${data.error}`);
            }
        } catch (error: any) {
            setMessage(`❌ Failed to delete photos: ${error.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-4xl mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-2">
                        Delete All Photos
                    </h1>
                    <p className="text-gray-400">
                        This will permanently delete all photos from the database.
                    </p>
                </div>

                <div className="bg-gray-900 rounded-lg p-8 border border-red-500/20">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-red-400 mb-4">⚠️ Warning</h2>
                        <p className="text-gray-300 mb-4">
                            This action will delete ALL photos from your gallery. This cannot be undone.
                        </p>
                    </div>

                    <button
                        onClick={handleDeleteAllPhotos}
                        disabled={isDeleting}
                        className={`w-full px-6 py-4 rounded-lg font-bold text-lg transition-all ${isDeleting
                                ? 'bg-gray-700 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700 active:scale-95'
                            }`}
                    >
                        {isDeleting ? 'Deleting...' : '🗑️ Delete All Photos'}
                    </button>

                    {message && (
                        <div className={`mt-6 p-4 rounded-lg ${message.includes('✅')
                                ? 'bg-green-900/30 border border-green-500/50 text-green-300'
                                : 'bg-red-900/30 border border-red-500/50 text-red-300'
                            }`}>
                            <p className="font-semibold">{message}</p>
                        </div>
                    )}

                    {deletedCount !== null && deletedCount === 0 && (
                        <div className="mt-4 p-4 rounded-lg bg-blue-900/30 border border-blue-500/50 text-blue-300">
                            <p>ℹ️ There were no photos to delete.</p>
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <a
                        href="/admin"
                        className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                    >
                        ← Back to Admin Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}
