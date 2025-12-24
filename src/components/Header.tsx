'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Youtube, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'Home' },
        { href: '/videos', label: 'Videos' },
        { href: '/photos', label: 'Photos' },
        { href: '/programs', label: 'Programs' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent tracking-tighter hover:opacity-80 transition-opacity">
                    AGTALIST
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors ${pathname === link.href ? 'text-red-500' : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Social Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <a
                        href="https://www.youtube.com/@3ackrab"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-red-900/40"
                    >
                        <Youtube size={16} />
                        <span>YouTube</span>
                    </a>
                    <a
                        href="https://pin.it/4KSyyBtF8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-gray-300 px-4 py-2 rounded-full text-sm font-medium transition-all border border-gray-800"
                    >
                        <span>Pinterest</span>
                        <ExternalLink size={14} />
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black border-b border-gray-800 overflow-hidden"
                    >
                        <nav className="flex flex-col p-6 gap-4">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-lg font-medium ${pathname === link.href ? 'text-red-500' : 'text-gray-300'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="h-px bg-gray-800 my-2" />
                            <a
                                href="https://www.youtube.com/@3ackrab"
                                target="_blank"
                                className="flex items-center gap-3 text-red-500 font-bold"
                            >
                                <Youtube size={20} />
                                YouTube Channel
                            </a>
                            <a
                                href="https://pin.it/4KSyyBtF8"
                                target="_blank"
                                className="flex items-center gap-3 text-gray-300 font-medium"
                            >
                                Pinterest
                            </a>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
