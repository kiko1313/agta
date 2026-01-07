"use client";

import React, { useEffect, useRef, useState } from "react";
import ReelPlayer from "./ReelPlayer";

export default function ReelWrapper({ video, index }: { video: any, index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.6 // 60% of video must be visible to play
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} className="h-full w-full snap-center relative">
      <ReelPlayer video={video} isActive={isVisible} />
    </div>
  );
}
