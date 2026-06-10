'use client';

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Play, ArrowRight, Calendar,
  Film, Camera, Maximize2, Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

/* ─────────────────────────────────────────────
   TypeScript Interfaces Configuration Mappings
───────────────────────────────────────────── */
interface Category {
  id: string;
  name: string;
}

interface MediaItemType {
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

interface ApiResponse {
  mediaItems: MediaItemType[];
  totalItems: number;
  totalPages: number;
}

interface CardProps {
  item: MediaItemType;
  style: React.CSSProperties;
  animDelay: number;
  isBig: boolean;
}

interface CTAButtonProps {
  isMobile: boolean;
  inView: boolean;
  animDelay: number;
}

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8000";

/** YouTube URL se thumbnail extract karne ka absolute optimized helper */
function getYoutubeThumb(url: string): string {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`;
  }
  return url;
}

function isYouTubeUrl(url: string) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

/* ─────────────────────────────────────────────
   HOOK: fires once when element enters viewport
───────────────────────────────────────────── */
function useInView(options: IntersectionObserverInit = {}): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) { 
          setInView(true); 
          observer.disconnect(); 
        } 
      },
      { threshold: 0.1, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);
  
  return [ref, inView];
}

const ANIM_CSS = `
  @keyframes gFadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes gRevealBadge {
    from { opacity: 0; transform: scale(0.8) translateY(-6px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes gCardIn {
    from { opacity: 0; transform: translateY(28px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes gBigCardIn {
    from { opacity: 0; transform: scale(0.92) translateX(-12px); }
    to   { opacity: 1; transform: scale(1) translateX(0); }
  }
  @keyframes gCtaIn {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes gImgZoom {
    from { transform: scale(1.07); }
    to   { transform: scale(1); }
  }
  @keyframes gPlayPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
    50%       { box-shadow: 0 0 0 8px rgba(239,68,68,0.15); }
  }
`;

/* ─── Badge ──────────────────────────────────────────────── */
function Badge({ label, isVideo }: { label: string; isVideo: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: "2px 8px", borderRadius: 99,
      fontSize: 8, fontWeight: 800, letterSpacing: "0.12em",
      textTransform: "uppercase",
      background: isVideo ? "rgba(239,68,68,0.2)" : "rgba(89,178,146,0.15)",
      border: `1px solid ${isVideo ? "rgba(252,165,165,0.3)" : "rgba(89,178,146,0.3)"}`,
      color: isVideo ? "#fecaca" : "#59B292",
      whiteSpace: "nowrap",
    }}>
      {isVideo ? <Film size={8} /> : <Camera size={8} />}
      {label}
    </span>
  );
}

/* ─── Photo Card ─────────────────────────────────────────── */
function PhotoCard({ item, style, animDelay, isBig }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [cardRef, cardIn] = useInView({ threshold: 0.08 });

  const animName = isBig ? "gBigCardIn" : "gCardIn";
  const duration = isBig ? "0.75s" : "0.6s";
  const formattedDate = new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <Link 
      href="/gallery"
      ref={cardRef as any}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...style,
        display: "block", position: "relative", borderRadius: 16, overflow: "hidden", cursor: "pointer",
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.22)" : "0 2px 12px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",
        opacity: cardIn ? 1 : 0,
        animation: cardIn ? `${animName} ${duration} cubic-bezier(0.22,1,0.36,1) ${animDelay}s both` : "none",
      }}
    >
      {/* Fallback Shimmer/Background */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg,#1e1b4b,#0f172a)",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: imgLoaded ? 0 : 1, transition: "opacity 0.4s",
      }}>
        <ImageIcon size={32} color="rgba(255,255,255,0.15)" className="animate-pulse" />
      </div>

      <img
        src={item.url} 
        alt={item.title}
        onLoad={() => setImgLoaded(true)} // 💡 FIXED: state trigger sync error
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          transform: hovered ? "scale(1.07)" : "scale(1)",
          transition: "transform 0.65s cubic-bezier(0.22,1,0.36,1)",
          opacity: imgLoaded ? 1 : 0, // 💡 FIXED: opacity handling logic mismatch
          animation: cardIn ? `gImgZoom 1.2s cubic-bezier(0.22,1,0.36,1) ${animDelay}s both` : "none",
        }}
      />

      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(2,6,23,0.9) 0%, rgba(2,6,23,0.2) 60%, transparent 100%)",
      }} />

      <div style={{
        position: "absolute", top: 10, right: 10,
        width: 28, height: 28, borderRadius: 8,
        background: "rgba(255,255,255,0.12)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: hovered ? 1 : 0,
        transform: hovered ? "scale(1) translateY(0)" : "scale(0.7) translateY(-4px)",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <Maximize2 size={11} color="white" strokeWidth={2.5} />
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 14 }}>
        <div style={{
          opacity: cardIn ? 1 : 0,
          transform: cardIn ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 0.4s ${animDelay + 0.2}s, transform 0.4s ${animDelay + 0.2}s`,
        }}>
          <Badge label={item.category?.name ?? "General"} isVideo={false} />
        </div>
        <h3 style={{
          color: "#fff", fontSize: 12, fontWeight: 600, lineHeight: 1.3, margin: "6px 0 0",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          fontFamily: "'DM Sans', sans-serif",
          opacity: cardIn ? 1 : 0,
          transform: cardIn ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 0.4s ${animDelay + 0.28}s, transform 0.4s ${animDelay + 0.28}s`,
        }}>
          {item.title}
        </h3>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(5px)",
          transition: "opacity 0.3s, transform 0.3s",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "rgba(255,255,255,0.5)" }}>
            <Calendar size={9} /> {formattedDate}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Video Card ─────────────────────────────────────────── */
function VideoCard({ item, style, animDelay }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [cardRef, cardIn] = useInView({ threshold: 0.08 });

  const thumbUrl = isYouTubeUrl(item.url) ? getYoutubeThumb(item.url) : item.url;
  const formattedDate = new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <Link
      href="/gallery"
      ref={cardRef as any}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...style,
        display: "block", position: "relative", borderRadius: 16, overflow: "hidden", cursor: "pointer",
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.22)" : "0 2px 12px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",
        opacity: cardIn ? 1 : 0,
        animation: cardIn ? `gCardIn 0.6s cubic-bezier(0.22,1,0.36,1) ${animDelay}s both` : "none",
      }}
    >
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg,#4c0519,#881337)",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: imgLoaded ? 0 : 1, transition: "opacity 0.4s",
      }}>
        <Film size={28} color="rgba(255,255,255,0.15)" />
      </div>

      <img
        src={thumbUrl} 
        alt={item.title}
        onLoad={() => setImgLoaded(true)}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          transform: hovered ? "scale(1.07)" : "scale(1)",
          transition: "transform 0.65s cubic-bezier(0.22,1,0.36,1)",
          opacity: imgLoaded ? 1 : 0,
          animation: cardIn ? `gImgZoom 1.2s cubic-bezier(0.22,1,0.36,1) ${animDelay}s both` : "none",
        }}
      />

      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(2,6,23,0.92) 0%, rgba(2,6,23,0.2) 60%, transparent 100%)",
      }} />

      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: hovered ? "rgba(239,68,68,0.9)" : "rgba(255,255,255,0.2)",
          border: "2px solid white",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: cardIn ? (hovered ? "scale(1.1)" : "scale(1)") : "scale(0)",
          transition: cardIn
            ? "background 0.3s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s"
            : `transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${animDelay + 0.3}s`,
          animation: hovered ? "gPlayPulse 1.5s ease-in-out infinite" : "none",
        }}>
          <Play size={14} fill="white" strokeWidth={0} style={{ marginLeft: 2, color: "white" }} />
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 14 }}>
        <div style={{
          opacity: cardIn ? 1 : 0,
          transform: cardIn ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 0.4s ${animDelay + 0.2}s, transform 0.4s ${animDelay + 0.2}s`,
        }}>
          <Badge label={item.category?.name ?? "General"} isVideo={true} />
        </div>
        <h3 style={{
          color: "#fff", fontSize: 12, fontWeight: 600, lineHeight: 1.3, margin: "6px 0 0",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          fontFamily: "'DM Sans', sans-serif",
          opacity: cardIn ? 1 : 0,
          transform: cardIn ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 0.4s ${animDelay + 0.28}s, transform 0.4s ${animDelay + 0.28}s`,
        }}>
          {item.title}
        </h3>
        <div style={{
          display: "flex", alignItems: "center", gap: 4, marginTop: 6,
          fontSize: 9, color: "rgba(255,255,255,0.5)",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(5px)",
          transition: "opacity 0.3s, transform 0.3s",
        }}>
          <Calendar size={9} /> {formattedDate}
        </div>
      </div>
    </Link>
  );
}

/* ─── CTA Button ─────────────────────────────────────────── */
function CTAButton({ isMobile, inView, animDelay }: CTAButtonProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href="/gallery"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        padding: isMobile ? "8px 18px" : "9px 22px",
        borderRadius: 12, border: "2px solid #06283D", cursor: "pointer",
        background: hovered ? "#59B292" : "#FFC94D", color: hovered ? "#fff" : "#093C5D",
        fontSize: isMobile ? 12 : 13, fontWeight: 700,
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: hovered ? "4px 4px 0px #06283D" : "2px 2px 0px #06283D",
        transform: hovered ? "translate(-2px, -2px)" : "translate(0, 0)",
        transition: "all 0.2s ease",
        opacity: inView ? 1 : 0,
        animation: inView ? `gCtaIn 0.55s cubic-bezier(0.22,1,0.36,1) ${animDelay}s both` : "none",
      }}
    >
      Explore Full Gallery
      <span style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 22, height: 22, borderRadius: 8,
        background: hovered ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.15)",
        transition: "background 0.2s",
      }}>
        <ArrowRight size={12} strokeWidth={2.5} style={{
          transform: hovered ? "translateX(2px)" : "translateX(0)",
          transition: "transform 0.2s",
        }} />
      </span>
    </Link>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function DocumentationSection() {
  const [items, setItems] = useState<MediaItemType[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [loading, setLoading] = useState(true);

  const [badgeRef, badgeIn] = useInView({ threshold: 0.2 });
  const [titleRef, titleIn] = useInView({ threshold: 0.2 });
  const [descRef,  descIn]  = useInView({ threshold: 0.2 });
  const [gridRef,  gridIn]  = useInView({ threshold: 0.06 });
  const [ctaRef,   ctaIn]   = useInView({ threshold: 0.3 });

  useEffect(() => {
    async function loadLivePreview() {
      try {
        const res = await axios.get<ApiResponse>(`${SERVER_URL}/api/media/`, {
          params: { page: 1 }
        });
        setItems(res.data.mediaItems ?? []);
        setTotalItems(res.data.totalItems ?? 0);
      } catch (err) {
        console.error("Failed to map dynamic section states:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLivePreview();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const onResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }
  }, []);

  const isMobile  = windowWidth < 640;
  const isTablet  = windowWidth >= 640 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  const visibleItems = useMemo(() => {
    const sliced = items.slice(0, 5);
    return isMobile ? sliced.slice(0, 3) : sliced;
  }, [items, isMobile]);

  const buildCardStyle = (item: MediaItemType, idx: number): React.CSSProperties => {
    const base: React.CSSProperties = { minHeight: isMobile ? 180 : 200 };
    if (isMobile) return { ...base, gridColumn: "span 1" };
    if (isTablet) {
      if (idx === 0) return { ...base, gridColumn: "span 2", minHeight: 230 };
      return { ...base, gridColumn: "span 1" };
    }
    if (idx === 0) return { ...base, gridColumn: "span 2", gridRow: "span 2", minHeight: "100%" };
    return { ...base, gridColumn: "span 1" };
  };

  const getDelay = (idx: number) => idx === 0 ? 0.05 : 0.1 + idx * 0.1;

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gap: isMobile ? 10 : 14,
    gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
    gridAutoRows: isDesktop ? "185px" : "auto",
    alignItems: "stretch",
  };

  if (loading) {
    return (
      <div className="w-full bg-[#f8fafc] py-24 flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-t-indigo-600 border-zinc-200 rounded-full animate-spin" />
      </div>
    );
  }

  if (visibleItems.length === 0) return null;

  return (
    <section
      style={{
        position: "relative", width: "100%",
        padding: isMobile ? "28px 12px 36px" : "40px 20px 48px",
        background: "#F8FAFC",
        borderTop: "2px solid #093C5D/10",
        fontFamily: "'DM Sans', sans-serif",
        boxSizing: "border-box", overflow: "hidden",
      }}
      aria-labelledby="gallery-heading"
    >
      <style dangerouslySetInnerHTML={{ __html: ANIM_CSS }} />
      
      <div style={{ position: "relative", maxWidth: 1050, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: isMobile ? 20 : 32 }}>
          <div ref={badgeRef as any} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 12px", borderRadius: 99,
            background: "#59B292", border: "2px solid #06283D",
            color: "#06283D", fontSize: 9, fontWeight: 900,
            letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12,
            opacity: badgeIn ? 1 : 0,
            animation: badgeIn ? "gRevealBadge 0.5s cubic-bezier(0.34,1.56,0.64,1) 0s both" : "none",
            boxShadow: "2px 2px 0px #06283D",
          }}>
            Media &amp; Documentation
          </div>

          <h2 ref={titleRef as any} id="gallery-heading" style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: isMobile ? 22 : isTablet ? 28 : 32,
            fontWeight: 800, color: "#093C5D", lineHeight: 1.2,
            maxWidth: 500, margin: "0 auto 10px", letterSpacing: "-0.01em",
            opacity: titleIn ? 1 : 0,
            animation: titleIn ? "gFadeUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s both" : "none",
          }}>
            Life at{" "}
            <span style={{ position: "relative", display: "inline-block", color: "#FA6781" }}>
              Neelgiri
              <span style={{
                position: "absolute", bottom: -2, left: 0, right: 0,
                height: 3, borderRadius: 2,
                background: "#FA6781",
                transformOrigin: "left",
                transform: titleIn ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.55s",
                display: "block",
              }} />
            </span>
            {" "}— Memories
          </h2>

          <p ref={descRef as any} style={{
            color: "#06283D", fontSize: isMobile ? 12 : 13,
            lineHeight: 1.6, maxWidth: 460, margin: "0 auto",
            opacity: descIn ? 1 : 0,
            animation: descIn ? "gFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.22s both" : "none",
          }}>
            A curated collection of our proudest moments — from award ceremonies to field expeditions.
          </p>
        </div>

        <div ref={gridRef as any} style={gridStyle}>
          {visibleItems.map((item, i) => {
            const cardStyle = buildCardStyle(item, i);
            const delay = getDelay(i);
            const isBigItem = !isMobile && i === 0;

            return item.mediaType === "image"
              ? <PhotoCard key={item.id} item={item} style={cardStyle} animDelay={delay} isBig={isBigItem} />
              : <VideoCard key={item.id} item={item} style={cardStyle} animDelay={delay} isBig={isBigItem} />;
          })}
        </div>

        <div ref={ctaRef as any} style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 8,
          marginTop: isMobile ? 20 : 28,
        }}>
          <CTAButton isMobile={isMobile} inView={ctaIn} animDelay={0.05} />
          <p style={{
            color: "#06283D", opacity: ctaIn ? 0.7 : 0, fontSize: 10, margin: 0,
            transform: ctaIn ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s 0.22s, transform 0.5s 0.22s",
          }}>
            View all {totalItems} dynamic items loaded in our media archive
          </p>
        </div>

      </div>
    </section>
  );
}