'use client';

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";

// Fixed accent colors keyed by position (0-3) — never change regardless of API data
const ACCENT_COLORS = ["#093C5D", "#FA6781", "#59B292", "#FFC94D"];

interface StatItem {
  iconName: string;
  statValue: string;
  statLabel: string;
}

function parseStatValue(val: string): { num: number; suffix: string } {
  const match = val.match(/^([\d,]+)(.*)/);
  if (!match) return { num: 0, suffix: val };
  return {
    num: parseInt(match[1].replace(/,/g, ""), 10),
    suffix: match[2] || "",
  };
}

function useAnimatedCounter(target: number, duration: number, start: boolean): number {
  const [count, setCount] = useState(0);
  const rafRef   = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const animate = useCallback((ts: number) => {
    if (!startRef.current) startRef.current = ts;
    const p = Math.min((ts - startRef.current) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    setCount(Math.round(eased * target));
    if (p < 1) rafRef.current = requestAnimationFrame(animate);
  }, [target, duration]);

  useEffect(() => {
    if (!start || target === 0) return;
    startRef.current = null;
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [start, target, animate]);

  return count;
}

function StatCard({
  stat,
  index,
  isVisible,
}: {
  stat: StatItem;
  index: number;
  isVisible: boolean;
}) {
  const { num, suffix } = parseStatValue(stat.statValue);
  const animated = useAnimatedCounter(num, 1800, isVisible);
  // Color is fixed by position — never affected by iconName from API
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  const isRightEdge = index % 2 === 1; // right column on mobile

  return (
    <div
      className={[
        "flex flex-col justify-center py-5 px-5 sm:px-7",
        // vertical divider: right border on all except last column per row
        !isRightEdge ? "border-r border-slate-100" : "",
        // top border for second row on mobile only
        index >= 2 ? "border-t border-slate-100" : "",
        // on md+ always show right divider except last item
        "md:border-t-0",
        index < 3 ? "md:border-r md:border-slate-100" : "md:border-r-0",
      ].join(" ")}
      style={{
        opacity:         isVisible ? 1 : 0,
        transform:       isVisible ? "translateY(0)" : "translateY(14px)",
        transition:      "opacity 0.5s ease, transform 0.5s ease",
        transitionDelay: `${index * 110}ms`,
      }}
    >
      {/* Number */}
      <p
        className="font-black leading-none tracking-tight text-[1.5rem] sm:text-[1.75rem]"
        style={{ color: accent }}
      >
        {animated.toLocaleString()}
        <span className="text-[0.6em] font-extrabold">{suffix}</span>
      </p>

      {/* Label */}
      <p className="mt-1.5 text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 leading-tight">
        {stat.statLabel}
      </p>

      {/* Thin accent underline */}
      <div
        className="mt-2.5 h-[3px] w-7 rounded-full"
        style={{ background: accent, opacity: 0.35 }}
      />
    </div>
  );
}

export default function HeroStatsBar() {
  const [stats,     setStats]     = useState<StatItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch from API
  useEffect(() => {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
    axios
      .get(`${SERVER_URL}/api/school-stats`)
      .then((r) => { if (r.data && Array.isArray(r.data)) setStats(r.data); })
      .catch(() => {});
  }, []);

  // Scroll-triggered animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); } },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [stats.length]);

  if (stats.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white border-b border-slate-100"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard
              key={i}
              stat={stat}
              index={i}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}