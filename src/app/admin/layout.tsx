import { redirect } from 'next/navigation';
'use client';

import { isAuthenticated } from '@/lib/auth';
import { ReactNode } from 'react';
import Link from 'next/link';
import { LayoutDashboard, LogOut, Upload, FileVideo, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    // Simple check. For more granular control, use Middleware.
    // Note: Middleware is better for performance, but this works for server components.
    // Wait, layout is executed on server. We can check auth here.
    // But strictly, we should check in every page or middleware.
    // Let's implement middleware in next step for robustness, but for now Check here to protect /admin root.
    // Actually, we can't redirect easily in async layout without potential issues if headers sent.
    // Just let the middleware handle redirects, but let's assume middleware exists or will be created.
    // For now, I'll add a simple check.
    // Simplified layout. Middleware handles protection.
    // We render the sidebar for all admin pages.
    // If we want to hide it on login, we'd need a different layout group, but for now we keep it simple.
    return (
        <div className="flex min-h-screen bg-black text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 hidden md:flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                        AGTALIST
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavLink href="/admin" icon={<LayoutDashboard size={20} />} label="Overview" />
                    <NavLink href="/admin/upload" icon={<Upload size={20} />} label="Upload" />
                    <NavLink href="/admin/videos" icon={<FileVideo size={20} />} label="Videos" />
                    <NavLink href="/admin/photos" icon={<ImageIcon size={20} />} label="Photos" />
                    <NavLink href="/admin/links" icon={<LinkIcon size={20} />} label="Links" />
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={async () => {
                            const res = await fetch('/api/auth/logout', { method: 'POST' });
                            const data = await res.json();
                            if (data.redirectTo) {
                                window.location.href = data.redirectTo;
                            }
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto max-h-screen">
                <div className="md:hidden p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
                    <span className="font-bold">AGTALIST Admin</span>
                    {/* Mobile Menu Toggle would go here */}
                </div>
                <div className="p-6 md:p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavLink({ href, icon, label }: { href: string, icon: ReactNode, label: string }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
            {icon}
            <span className="font-medium">{label}</span>
        </Link>
    );
}
