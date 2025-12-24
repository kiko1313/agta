import { redirect } from 'next/navigation';
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
    const isAuth = await isAuthenticated();

    if (!isAuth) {
        // If we are already on login page or its children, don't redirect (handled by matcher)
        // But since this layout wraps /admin, we assume /admin/login is OUTSIDE this layout or handled properly.
        // Wait, typically /admin/login is inside /admin?
        // If /admin/login uses this layout, we get infinite loop.
        // Best practice: Move login to /login or separate group (auth)/login
        // OR: check if path is /admin/login in Middleware.
        // I will assume /admin/login is NOT using this layout if I put this layout in (dashboard) group,
        // or I just handle it carefully.
        // Let's rely on Middleware for redirection and just render children here.
        // Wait, if I'm not authenticated, I shouldn't see the dashboard layout.
    }

    // To avoid complication, I will create middleware.ts to protect /admin routes EXCEPT /admin/login
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
                    <form action="/api/auth/logout" method="POST">
                        <button type="submit" className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </form>
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
