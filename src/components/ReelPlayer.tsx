"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Volume2, VolumeX, Heart, Share2, MoreVertical, Download } from "lucide-react";
import Link from 'next/link';

interface Video {
    _id: string;
    title: string;
    url: string;
    thumbnailUrl?: string;
    description?: string;
    category?: string;
}

interface ReelPlayerProps {
    video: Video;
    isActive: boolean;
    monetagLink?: string;
}

export default function ReelPlayer({ video, isActive, monetagLink = "https://otieu.com/4/10400619" }: ReelPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [showOverlay, setShowOverlay] = useState(true);
    const [progress, setProgress] = useState(0);

    // Auto-play/pause based on active state (intersection observer from parent)
    useEffect(() => {
        if (isActive) {
            if (videoRef.current) {
                // Reset state for new active video
                setIsMuted(true);
                setShowOverlay(true);
                videoRef.current.currentTime = 0;

                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsPlaying(true);
                        })
                        .catch((error) => {
                            console.log("Autoplay prevented:", error);
                            setIsPlaying(false);
                        });
                }
            }
        } else {
            if (videoRef.current) {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    }, [isActive]);

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(p);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        // 1. Open Monetag Link
        window.open(monetagLink, '_blank');

        // 2. Unmute and Play
        if (videoRef.current) {
            videoRef.current.muted = false;
            setIsMuted(false);
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }

        // 3. Hide Overlay
        setShowOverlay(false);
    };

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            // If overlay is still there, treat play click as overlay interaction
            if (showOverlay) {
                handleOverlayClick(e);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;

        if (showOverlay) {
            handleOverlayClick(e);
            return;
        }

        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
    };

    // Helper for YouTube embedding if needed, though this player is optimized for direct MP4
    // We'll trust the parent to pass direct URLs ideally, or handle basic iframe if not.
    // BUT: "Reels" usually implies direct video playback for smooth scrolling. 
    // If video.url is YouTube, we might need an iframe which captures clicks differently.
    // For this implementation, we assume direct file access or compatible <video> source.

    const isYouTube = video.url.includes("youtube.com") || video.url.includes("youtu.be");

    if (isYouTube) {
        // Fallback for YouTube - simplified as overlays over iframes are tricky due to terms of service
        // But we can put a transparent div over it ;)
        return (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
                <iframe
                    src={`https://www.youtube.com/embed/${video.url.split('v=')[1] || video.url.split('/').pop()}?autoplay=${isActive ? 1 : 0}&mute=1&controls=0&loop=1`}
                    className="w-full h-full object-cover pointer-events-none" // pointer-events-none allows clicks to pass through to our overlay
                />
                {/* Overlay for Monetag */}
                <div
                    className="absolute inset-0 z-20 flex items-center justify-center bg-transparent cursor-pointer"
                    onClick={handleOverlayClick}
                >
                    {showOverlay && (
                        <div className="bg-black/60 px-6 py-3 rounded-full flex items-center gap-2 animate-pulse border border-white/20 backdrop-blur-sm">
                            <VolumeX className="w-6 h-6 text-white" />
                            <span className="text-white font-bold">Tap to Unmute</span>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-full h-full bg-black flex items-center justify-center snap-center">
            {/* Video Element */}
            <video
                ref={videoRef}
                src={video.url}
                className="w-full h-full object-cover"
                playsInline
                loop
                muted={isMuted} // Start muted for autoplay policy
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
            />

            {/* Monetag / Interaction Overlay */}
            {showOverlay && (
                <div
                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 cursor-pointer transition-opacity duration-300"
                    onClick={handleOverlayClick}
                >
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-red-600/90 hover:bg-red-600 p-6 rounded-full shadow-lg shadow-red-900/50 transform transition-transform hover:scale-110 active:scale-95 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white fill-current ml-1" />
                        </div>
                        <div className="bg-black/60 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium border border-white/10 backdrop-blur-md">
                            <VolumeX className="w-4 h-4" />
                            Tap to Watch & Unmute
                        </div>
                    </div>
                </div>
            )}

            {/* UI Controls Layer (Bottom & Right) */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-end p-4 bg-gradient-to-b from-transparent via-transparent to-black/80">

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800/50">
                    <div
                        className="h-full bg-red-600 transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex items-end justify-between pb-6">
                    {/* Info Section */}
                    <div className="flex-1 pointer-events-auto max-w-[80%]">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-xs font-bold border border-white/20">
                                AL
                            </div>
                            <span className="font-semibold text-sm">Agtalist</span>
                            <button className="text-xs bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded transition-colors">Follow</button>
                        </div>
                        <h2 className="text-white font-bold text-base line-clamp-2 md:text-lg drop-shadow-md mb-1">
                            {video.title}
                        </h2>
                        {video.description && (
                            <p className="text-gray-200 text-sm line-clamp-2 opacity-90 mb-2">
                                {video.description}
                            </p>
                        )}
                        {/* Audio Track Marquee (Mock) */}
                        <div className="flex items-center gap-2 text-xs text-gray-300 opacity-80">
                            <Volume2 size={12} />
                            <div className="overflow-hidden w-32 whitespace-nowrap">
                                <span>Original Audio - Agtalist • Original Audio - Agtalist</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex flex-col items-center gap-4 pointer-events-auto ml-2">
                        <button
                            className="flex flex-col items-center gap-1 group"
                            onClick={(e) => {
                                e.stopPropagation();
                                // Like logic here
                            }}
                        >
                            <div className="bg-gray-800/60 p-3 rounded-full group-active:scale-95 transition-transform backdrop-blur-sm hover:bg-gray-700/60">
                                <Heart className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium">Like</span>
                        </button>

                        <button
                            className="flex flex-col items-center gap-1 group"
                            onClick={(e) => {
                                handleOverlayClick(e); // Monetize download attempt
                            }}
                        >
                            <div className="bg-gray-800/60 p-3 rounded-full group-active:scale-95 transition-transform backdrop-blur-sm hover:bg-gray-700/60">
                                <Download className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium">Save</span>
                        </button>

                        <button
                            className="flex flex-col items-center gap-1 group"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(window.location.href);
                                alert("Link copied!");
                            }}
                        >
                            <div className="bg-gray-800/60 p-3 rounded-full group-active:scale-95 transition-transform backdrop-blur-sm hover:bg-gray-700/60">
                                <Share2 className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium">Share</span>
                        </button>

                        <button
                            className="flex flex-col items-center gap-1 group"
                            onClick={(e) => {
                                // Mute/Unmute without link trigger logic for the dedicated button
                                e.stopPropagation();
                                if (videoRef.current) {
                                    videoRef.current.muted = !videoRef.current.muted;
                                    setIsMuted(videoRef.current.muted);
                                }
                            }}
                        >
                            <div className="bg-gray-800/60 p-3 rounded-full group-active:scale-95 transition-transform backdrop-blur-sm hover:bg-gray-700/60">
                                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
