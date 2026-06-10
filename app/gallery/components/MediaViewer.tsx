"use client";

import { useEffect, useState, useRef } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  X, 
  Download, 
  Share2, 
  RotateCw, 
  Maximize2, 
  Minimize2 
} from "lucide-react";

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

interface MediaViewerProps {
  item: MediaItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  isLoadingNext: boolean;
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

function VideoSkeleton({ title }: { title: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-zinc-950 select-none">
      <div className="relative w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-t-white border-white/10 animate-spin" />
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/40 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 animate-pulse">{title || "Streaming"}</p>
    </div>
  );
}

export default function MediaViewer({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  isLoadingNext,
}: MediaViewerProps) {
  const [ready, setReady] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [buffering, setBuffering] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setReady(false);
    setIframeReady(false);
    setBuffering(true);
    setRotation(0); 
  }, [item.id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && (hasNext || isLoadingNext)) onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext, hasPrev, hasNext, isLoadingNext]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onCanPlay = () => setBuffering(false);
    el.addEventListener("canplay", onCanPlay);
    return () => el.removeEventListener("canplay", onCanPlay);
  }, [item.id]);

  const ytId = item.mediaType === "video" && isYouTubeUrl(item.url) ? getYouTubeId(item.url) : null;
  const formattedDate = !isLoadingNext ? new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const handleDownload = async () => {
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${item.title.replace(/\s+/g, "_") || "gallery_file"}.${item.mediaType === "video" ? "mp4" : "jpg"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(item.url, "_blank");
    }
  };

  const handleShare = async () => {
    const shareData = { title: item.title, text: `Check out this ${item.mediaType} from Gallery`, url: item.url };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(item.url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 select-none transition-all duration-300"
      onClick={onClose}
    >
      {/* ─── Top Control Panel ─── */}
      <div 
        className="w-full flex items-center justify-between px-4 py-4 bg-gradient-to-b from-black/90 via-black/40 to-transparent定位 z-30 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col min-w-0 max-w-[60%] pl-2">
          <p className="text-white font-medium text-sm sm:text-base tracking-wide truncate">{isLoadingNext ? "Loading Content..." : item.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-zinc-300 capitalize bg-zinc-800 border border-zinc-700/50 px-2.5 py-0.5 rounded-md font-semibold tracking-wide">
              {item.category?.name ?? "General"}
            </span>
            {!isLoadingNext && <span className="text-xs text-zinc-400 font-medium">{formattedDate}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 pr-2">
          {!isLoadingNext && (
            <>
              {item.mediaType === "image" && (
                <button onClick={handleRotate} title="Rotate" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all flex items-center justify-center">
                  <RotateCw className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                </button>
              )}
              <button onClick={handleDownload} title="Download" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all flex items-center justify-center">
                <Download className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </button>
              <button onClick={handleShare} title="Share" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all flex items-center justify-center">
                <Share2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </button>
              <button onClick={toggleFullscreen} title="Toggle Fullscreen" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all flex items-center justify-center">
                {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> : <Maximize2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />}
              </button>
            </>
          )}
          <button onClick={onClose} title="Close" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-red-600 transition-all flex items-center justify-center shadow-lg">
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* ─── Main Screen Immersive Viewport ─── */}
      <div className="relative flex-1 flex items-center justify-center w-full overflow-hidden bg-black">
        
        {/* Navigation Controls */}
        {hasPrev && !isLoadingNext && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 border border-zinc-800 hover:bg-zinc-900 text-white/70 hover:text-white transition-all hover:scale-110 z-30 flex items-center justify-center group shadow-2xl backdrop-blur-md"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
          </button>
        )}
        {(hasNext || isLoadingNext) && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            disabled={isLoadingNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 border border-zinc-800 hover:bg-zinc-900 text-white/70 hover:text-white transition-all hover:scale-110 z-30 flex items-center justify-center group shadow-2xl backdrop-blur-md disabled:opacity-20"
          >
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}

        {/* Media Frame Container (💡 FIXED: Space maximizing styles) */}
        <div 
          className="w-full h-full flex items-center justify-center p-1 sm:p-4 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {isLoadingNext ? (
            <div className="flex flex-col items-center gap-3 text-zinc-500">
              <div className="w-8 h-8 rounded-full border-2 border-t-teal-500 border-zinc-800 animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Loading Next Page…</span>
            </div>
          ) : item.mediaType === "image" ? (
            <div 
              className="relative w-full h-full flex items-center justify-center transition-transform duration-300"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {!ready && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-t-zinc-400 border-transparent rounded-full animate-spin" />
                </div>
              )}
              <img
                src={item.url}
                alt={item.title}
                onLoad={() => setReady(true)}
                className={`max-w-full max-h-[88vh] md:max-h-[90vh] object-contain select-none transition-all duration-300 shadow-2xl ${
                  ready ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
              />
            </div>
          ) : ytId ? (
            /* 💡 FIXED: Stripped old absolute max-w bounds constraints to cover maximum screen height */
            <div className="w-full h-full max-w-7xl max-h-[85vh] aspect-video bg-black relative shadow-2xl overflow-hidden flex items-center justify-center">
              {!iframeReady && <div className="absolute inset-0 z-10"><VideoSkeleton title={item.title} /></div>}
              <iframe
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&fs=1`}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setIframeReady(true)}
                className="w-full h-full absolute inset-0 border-0"
              />
            </div>
          ) : (
            /* 💡 FIXED: Native video player sizing match */
            <div className="w-full h-full max-w-7xl max-h-[85vh] aspect-video relative bg-black shadow-2xl overflow-hidden flex items-center justify-center">
              {buffering && <div className="absolute inset-0 z-10"><VideoSkeleton title={item.title} /></div>}
              <video
                ref={videoRef}
                src={item.url}
                controls
                autoPlay
                className={`w-full h-full object-contain bg-black transition-opacity duration-500 ${buffering ? "opacity-0" : "opacity-100"}`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Immersive Footer Status Bar */}
      <div 
        className="w-full px-6 py-4 bg-gradient-to-t from-black/90 to-transparent z-20 flex justify-center sm:justify-end shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hidden sm:flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-wider select-none">
          <span className="bg-zinc-900 border border-zinc-800/80 px-1.5 py-0.5 rounded font-mono">←</span>
          <span className="bg-zinc-900 border border-zinc-800/80 px-1.5 py-0.5 rounded font-mono">→</span>
          <span className="text-zinc-600 font-sans px-1">Navigate</span>
          <span className="bg-zinc-900 border border-zinc-800/80 px-1.5 py-0.5 rounded font-mono">Esc</span>
          <span className="text-zinc-600 font-sans px-1">Exit View</span>
        </div>
        <p className="sm:hidden text-zinc-500 text-[10px] font-bold uppercase tracking-widest select-none">
          Swipe left/right or use top controls to manage
        </p>
      </div>
    </div>
  );
}