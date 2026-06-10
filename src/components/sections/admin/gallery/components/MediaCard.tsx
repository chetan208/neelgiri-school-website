"use client";

import { useState } from "react";

interface MediaItem {
  id: string;
  title: string;
  mediaType: "image" | "video";
  url: string;
  publicId: string | null;
  categoryId: string;
  createdAt: string;
  category: { id: string; name: string; createdAt: string };
}

interface MediaCardProps {
  item: MediaItem;
  selected: boolean;
  onToggle: () => void;
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export default function MediaCard({ item, selected, onToggle }: MediaCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const ytId = item.mediaType === "video" ? getYouTubeId(item.url) : null;
  const thumbUrl = ytId
    ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
    : item.url;

  return (
    <div
      onClick={onToggle}
      className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-200 ${
        selected
          ? "ring-2 ring-[#FFC94D] ring-offset-2 shadow-lg scale-[0.98]"
          : "ring-1 ring-[#093C5D]/10 hover:ring-[#093C5D]/30 hover:shadow-md"
      }`}
      style={{ aspectRatio: "4/3" }}
    >
      {/* Thumbnail */}
      <div className="absolute inset-0 bg-gray-100">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-100" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbUrl}
          alt={item.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      {/* Video play icon */}
      {item.mediaType === "video" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Hover overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-200 ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />

      {/* Checkbox */}
      <div className={`absolute top-2 left-2 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 z-10 ${
        selected
          ? "bg-[#59B292] border-[#59B292]"
          : "bg-white/80 border-gray-300 opacity-0 group-hover:opacity-100"
      }`}>
        {selected && (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Type badge */}
      <div className="absolute top-2 right-2 z-10">
        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
          item.mediaType === "video"
            ? "bg-[#FA6781] text-white"
            : "bg-[#59B292] text-white"
        }`}>
          {item.mediaType}
        </span>
      </div>

      {/* Caption */}
      <div className={`absolute bottom-0 left-0 right-0 px-2.5 pb-2 transition-opacity duration-200 ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <p className="text-white text-xs font-medium truncate drop-shadow-sm">{item.title}</p>
        <p className="text-white/60 text-[10px] capitalize">{item.category?.name}</p>
      </div>
    </div>
  );
}