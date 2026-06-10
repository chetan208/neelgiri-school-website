"use client";

import { useState } from "react";

interface Category {
  id: string;
  name: string;
  createdAt: string;
}

interface MediaItem {
  id: string;
  title: string;
  mediaType: "image" | "video";
  url: string;
  publicId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

interface GalleryCardProps {
  item: MediaItem;
  onClick: () => void;
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

function isYouTubeUrl(url: string) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export default function GalleryCard({ item, onClick }: GalleryCardProps) {
  const [loaded, setLoaded] = useState(false);
  const ytId = item.mediaType === "video" && isYouTubeUrl(item.url) ? getYouTubeId(item.url) : null;
  const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : item.url;

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer rounded-xl overflow-hidden bg-[#FFC94D]/20 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ aspectRatio: "4/3" }}
    >
      <img
        src={thumbUrl}
        alt={item.title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
      />

      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#FFC94D]/20 via-[#F8FAFC] to-[#FFC94D]/20 bg-[length:200%_100%]" />
      )}

      {item.mediaType === "video" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="w-11 h-11 rounded-full bg-white/95 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#FFC94D] ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5">
        <p className="text-white text-xs font-semibold leading-snug line-clamp-2">{item.title}</p>
        <p className="text-white/70 text-[10px] mt-0.5 capitalize">{item.category?.name ?? "General"}</p>
      </div>

      <div className="absolute top-2 left-2">
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm text-white ${
          item.mediaType === "video" ? "bg-[#FFC94D]" : "bg-[#093C5D]"
        }`}>
          {item.mediaType}
        </span>
      </div>
    </div>
  );
}