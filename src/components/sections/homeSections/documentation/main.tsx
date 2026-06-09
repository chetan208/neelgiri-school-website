'use client';

import { useState, useEffect, useRef } from "react";
import {
  Play, ArrowRight, Calendar, Eye,
  Film, Camera, Maximize2, Image as ImageIcon,
} from "lucide-react";

/* ─────────────────────────────────────────────
   TypeScript Interfaces Configuration Mappings
───────────────────────────────────────────── */
interface MediaItemType {
  id: number;
  type: "photo" | "video";
  category: string;
  title: string;
  date: string;
  src: string;
  albumCount?: number;
  duration?: string;
  big: boolean;
}

interface CardProps {
  item: MediaItemType;
  style: React.CSSProperties;
  animDelay: number;
}

interface CTAButtonProps {
  isMobile: boolean;
  inView: boolean;
  animDelay: number;
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
  @keyframes gFadeSlide {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes gScaleIn {
    from { opacity: 0; transform: scale(0.86) translateY(16px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
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

const MEDIA_ITEMS: MediaItemType[] = [
  {
    id: 1, type: "photo", category: "Annual Function",
    title: "Annual Day Celebrations 2024", date: "Dec 18, 2024",
    src: "https://picsum.photos/seed/school1/900/700", albumCount: 48, big: true,
  },
  {
    id: 2, type: "video", category: "Sports Day",
    title: "Sports Day 2024 — Highlights", date: "Nov 5, 2024",
    src: "https://picsum.photos/seed/school2/600/400", duration: "4:32", big: false,
  },
  {
    id: 3, type: "photo", category: "Science Fair",
    title: "Inter-School Exhibition", date: "Oct 22, 2024",
    src: "https://picsum.photos/seed/school3/600/400", albumCount: 31, big: false,
  },
  {
    id: 4, type: "photo", category: "Arts & Culture",
    title: "Classical Dance Recital", date: "Sep 14, 2024",
    src: "https://picsum.photos/seed/school4/600/400", albumCount: 24, big: false,
  },
  {
    id: 5, type: "video", category: "Commencement",
    title: "Graduation Ceremony 2024", date: "Mar 30, 2024",
    src: "https://picsum.photos/seed/school5/600/400", duration: "12:08", big: false,
  },
];

/* ─── Badge ──────────────────────────────────────────────── */
function Badge({ label, isVideo }: { label: string; isVideo: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: "2px 8px", borderRadius: 99,
      fontSize: 8, fontWeight: 800, letterSpacing: "0.12em",
      textTransform: "uppercase",
      background: isVideo ? "rgba(239,68,68,0.2)" : "rgba(99,102,241,0.2)",
      border: `1px solid ${isVideo ? "rgba(252,165,165,0.3)" : "rgba(129,140,248,0.3)"}`,
      color: isVideo ? "#fecaca" : "#c7d2fe",
      whiteSpace: "nowrap",
    }}>
      {isVideo ? <Film size={8} /> : <Camera size={8} />}
      {label}
    </span>
  );
}

/* ─── Photo Card ─────────────────────────────────────────── */
function PhotoCard({ item, style, animDelay }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [cardRef, cardIn] = useInView({ threshold: 0.08 });

  const animName = item.big ? "gBigCardIn" : "gCardIn";
  const duration = item.big ? "0.75s" : "0.6s";

  return (
    <div
      ref={cardRef as any}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...style,
        position: "relative", borderRadius: 16, overflow: "hidden", cursor: "pointer",
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.22)" : "0 2px 12px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",
        opacity: cardIn ? 1 : 0,
        animation: cardIn ? `${animName} ${duration} cubic-bezier(0.22,1,0.36,1) ${animDelay}s both` : "none",
      }}
      role="article"
    >
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg,#312e81,#1e1b4b)",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: imgLoaded && !imgError ? 0 : 1, transition: "opacity 0.4s",
      }}>
        <ImageIcon size={32} color="rgba(255,255,255,0.15)" />
      </div>

      <img
        src={item.src} alt={item.title}
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgError(true)}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          transform: hovered ? "scale(1.07)" : "scale(1)",
          transition: "transform 0.65s cubic-bezier(0.22,1,0.36,1)",
          opacity: imgLoaded && !imgError ? 1 : 0,
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
          <Badge label={item.category} isVideo={false} />
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
            <Calendar size={9} /> {item.date}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 700, color: "#a5b4fc" }}>
            <Eye size={9} /> {item.albumCount} photos
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Video Card ─────────────────────────────────────────── */
function VideoCard({ item, style, animDelay }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [cardRef, cardIn] = useInView({ threshold: 0.08 });

  return (
    <div
      ref={cardRef as any}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...style,
        position: "relative", borderRadius: 16, overflow: "hidden", cursor: "pointer",
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.22)" : "0 2px 12px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",
        opacity: cardIn ? 1 : 0,
        animation: cardIn ? `gCardIn 0.6s cubic-bezier(0.22,1,0.36,1) ${animDelay}s both` : "none",
      }}
      role="article"
    >
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg,#4c0519,#881337)",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: imgLoaded && !imgError ? 0 : 1, transition: "opacity 0.4s",
      }}>
        <Film size={28} color="rgba(255,255,255,0.15)" />
      </div>

      <img
        src={item.src} alt={item.title}
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgError(true)}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          transform: hovered ? "scale(1.07)" : "scale(1)",
          transition: "transform 0.65s cubic-bezier(0.22,1,0.36,1)",
          opacity: imgLoaded && !imgError ? 1 : 0,
          animation: cardIn ? `gImgZoom 1.2s cubic-bezier(0.22,1,0.36,1) ${animDelay}s both` : "none",
        }}
      />

      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(2,6,23,0.92) 0%, rgba(2,6,23,0.2) 60%, transparent 100%)",
      }} />

      <div style={{
        position: "absolute", top: 10, right: 10,
        padding: "2px 8px", borderRadius: 6,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
        color: "#fff", fontSize: 9, fontWeight: 700,
        opacity: cardIn ? 1 : 0,
        transform: cardIn ? "translateY(0)" : "translateY(-6px)",
        transition: `opacity 0.35s ${animDelay + 0.3}s, transform 0.35s ${animDelay + 0.3}s`,
      }}>
        {item.duration}
      </div>

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
          <Badge label={item.category} isVideo={true} />
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
          <Calendar size={9} /> {item.date}
        </div>
      </div>
    </div>
  );
}

/* ─── CTA Button ─────────────────────────────────────────── */
function CTAButton({ isMobile, inView, animDelay }: CTAButtonProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        padding: isMobile ? "10px 20px" : "11px 24px",
        borderRadius: 12, border: "none", cursor: "pointer",
        background: hovered ? "#3730a3" : "#4338ca", color: "#fff",
        fontSize: isMobile ? 12 : 13, fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: hovered ? "0 8px 24px rgba(99,102,241,0.45)" : "0 4px 16px rgba(99,102,241,0.2)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.25s ease",
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
    </button>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function DocumentationSection() {
  const [windowWidth, setWindowWidth] = useState(1200);

  const [badgeRef, badgeIn] = useInView({ threshold: 0.2 });
  const [titleRef, titleIn] = useInView({ threshold: 0.2 });
  const [descRef,  descIn]  = useInView({ threshold: 0.2 });
  const [gridRef,  gridIn]  = useInView({ threshold: 0.06 });
  const [ctaRef,   ctaIn]   = useInView({ threshold: 0.3 });

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

  const visibleItems = isMobile ? MEDIA_ITEMS.slice(0, 3) : MEDIA_ITEMS;

  const buildCardStyle = (item: MediaItemType): React.CSSProperties => {
    const base: React.CSSProperties = { minHeight: isMobile ? 190 : 210 };
    if (isMobile) return { ...base, gridColumn: "span 1" };
    if (isTablet) {
      if (item.big) return { ...base, gridColumn: "span 2", minHeight: 240 };
      return { ...base, gridColumn: "span 1" };
    }
    if (item.big) return { ...base, gridColumn: "span 2", gridRow: "span 2", minHeight: "100%" };
    return { ...base, gridColumn: "span 1" };
  };

  const getDelay = (item: MediaItemType, i: number) => item.big ? 0.05 : 0.1 + i * 0.1;

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gap: isMobile ? 10 : 12,
    gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
    gridAutoRows: isDesktop ? "190px" : "auto",
    alignItems: "stretch",
  };

  return (
    <section
      style={{
        position: "relative", width: "100%",
        padding: isMobile ? "32px 14px 40px" : "44px 20px 52px",
        background: "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(99,102,241,0.05) 0%, transparent 65%), #f8fafc",
        fontFamily: "'DM Sans', sans-serif",
        boxSizing: "border-box", overflow: "hidden",
      }}
      aria-labelledby="gallery-heading"
    >
      <style dangerouslySetInnerHTML={{ __html: ANIM_CSS }} />
      
      <div style={{
        position: "absolute", top: -80, right: -60,
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
        opacity: badgeIn ? 1 : 0, transition: "opacity 1.2s ease", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: -40,
        width: 260, height: 260, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(67,56,202,0.06) 0%, transparent 70%)",
        opacity: gridIn ? 1 : 0, transition: "opacity 1.2s ease", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", maxWidth: 1050, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: isMobile ? 24 : 36 }}>
          <div ref={badgeRef as any} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 12px", borderRadius: 99,
            background: "#eef2ff", border: "1px solid #e0e7ff",
            color: "#4338ca", fontSize: 9, fontWeight: 800,
            letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12,
            opacity: badgeIn ? 1 : 0,
            animation: badgeIn ? "gRevealBadge 0.5s cubic-bezier(0.34,1.56,0.64,1) 0s both" : "none",
          }}>
            Media &amp; Documentation
          </div>

          <h2 ref={titleRef as any} id="gallery-heading" style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: isMobile ? 24 : isTablet ? 30 : 34,
            fontWeight: 800, color: "#0f172a", lineHeight: 1.2,
            maxWidth: 500, margin: "0 auto 10px", letterSpacing: "-0.01em",
            opacity: titleIn ? 1 : 0,
            animation: titleIn ? "gFadeUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s both" : "none",
          }}>
            Life at{" "}
            <span style={{ position: "relative", display: "inline-block", color: "#3730a3" }}>
              Neelgiri
              <span style={{
                position: "absolute", bottom: -2, left: 0, right: 0,
                height: 3, borderRadius: 2,
                background: "linear-gradient(90deg, #6366f1, #4f46e5)",
                transformOrigin: "left",
                transform: titleIn ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.55s",
                display: "block",
              }} />
            </span>
            {" "}— Memories
          </h2>

          <p ref={descRef as any} style={{
            color: "#64748b", fontSize: isMobile ? 12 : 13,
            lineHeight: 1.6, maxWidth: 460, margin: "0 auto",
            opacity: descIn ? 1 : 0,
            animation: descIn ? "gFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.22s both" : "none",
          }}>
            A curated collection of our proudest moments — from award ceremonies to field expeditions.
          </p>
        </div>

        <div ref={gridRef as any} style={gridStyle}>
          {visibleItems.map((item, i) => {
            const cardStyle = buildCardStyle(item);
            const delay = getDelay(item, i);
            return item.type === "photo"
              ? <PhotoCard key={item.id} item={item} style={cardStyle} animDelay={delay} />
              : <VideoCard key={item.id} item={item} style={cardStyle} animDelay={delay} />;
          })}
        </div>

        <div ref={ctaRef as any} style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 8,
          marginTop: isMobile ? 24 : 32,
        }}>
          <CTAButton isMobile={isMobile} inView={ctaIn} animDelay={0.05} />
          <p style={{
            color: "#94a3b8", fontSize: 10, margin: 0,
            opacity: ctaIn ? 1 : 0,
            transform: ctaIn ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s 0.22s, transform 0.5s 0.22s",
          }}>
            View all 1,200+ photos and 85+ videos in our media archive
          </p>
        </div>

      </div>
    </section>
  );
}