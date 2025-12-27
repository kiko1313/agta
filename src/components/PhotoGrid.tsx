'use client';

import React from 'react';

type Photo = {
  _id: string;
  title: string;
  url: string;
};

type Props = {
  photos: Photo[];
};

export default function PhotoGrid({ photos }: Props) {
  const direct = process.env.NEXT_PUBLIC_MONETAG_DIRECT;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    try {
      if (direct) {
        window.open(direct, '_blank', 'noopener,noreferrer');
      }
    } catch {}
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {}
  };

  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {photos.map((photo) => (
        <a
          key={photo._id}
          href={photo.url}
          onClick={(e) => handleClick(e, photo.url)}
          target="_blank"
          rel="noopener noreferrer"
          className="break-inside-avoid relative group rounded-xl overflow-hidden block"
          aria-label={photo.title}
        >
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full object-cover hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white font-medium px-4 text-center">{photo.title}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
