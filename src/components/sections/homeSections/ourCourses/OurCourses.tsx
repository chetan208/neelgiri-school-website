'use client';

import React, { useState } from "react";
import { GraduationCap, ChevronRight } from "lucide-react";
import { levels } from "./data";
import { useInView } from "./useInView";
import DesktopPanel from "./DesktopPanel";
import MobileCard from "./MobileCard";
import "./styles.css";

export default function OurCourses() {
  const [active, setActive] = useState("primary");
  const [openMobile, setOpenMobile] = useState<string | null>("primary");

  const [headerRef, headerIn] = useInView<HTMLParagraphElement>();
  const [badgeRef,  badgeIn]  = useInView<HTMLDivElement>();
  const [tabsRef,   tabsIn]   = useInView<HTMLDivElement>();
  const [miniRef,   miniIn]   = useInView<HTMLDivElement>();

  const level = levels.find((l) => l.id === active)!;

  return (
    <section id="our-courses" className="cr relative w-full bg-white overflow-hidden border-t border-slate-200/60" style={{ minHeight: "100svh", padding: "clamp(48px,8vh,80px) 16px" }}>
      <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" />

      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none blur-[100px]" style={{ background: level.color, opacity: 0.08, transition: "background 0.5s" }} />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full pointer-events-none blur-[80px]" style={{ background: level.color, opacity: 0.07, transition: "background 0.5s" }} />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-6">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div ref={badgeRef}>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 ${badgeIn ? "in-view-slide" : "opacity-0"}`} style={{ animationDelay: "0s" }}>
              <GraduationCap size={11} className="text-slate-400" /> Academic Programmes
            </div>
            <h2 className={`serif text-[clamp(1.8rem,4vw,2.6rem)] font-black text-brand-primary leading-tight ${badgeIn ? "in-view-up" : "opacity-0"}`} style={{ animationDelay: "0.12s" }}>
              Our <span className="shimmer-text">Courses</span>
            </h2>
          </div>
          <p ref={headerRef} className={`text-slate-500 text-[13px] md:text-sm leading-relaxed max-w-xs font-medium ${headerIn ? "in-view-slideL" : "opacity-0"}`} style={{ animationDelay: "0.2s" }}>
            Tailored programmes for every stage of your child&apos;s journey.
          </p>
        </div>

        <div ref={tabsRef} className="desktop-only flex gap-2">
          {levels.map((l, i) => {
            const isA = l.id === active;
            const TabIcon = l.icon;
            return (
              <button
                key={l.id}
                className={`level-tab flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer border-0 transition-all ${isA ? "text-white shadow-sm" : "text-brand-text-dark bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs"} ${tabsIn ? "in-view-tab" : "opacity-0"}`}
                style={{ ...(isA ? { background: l.color, boxShadow: `0 4px 12px -2px ${l.color}35` } : {}), animationDelay: `${i * 0.1}s` }}
                onClick={() => setActive(l.id)}
              >
                <TabIcon size={14} strokeWidth={2.5} /> {l.label}
                <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={isA ? { background: "rgba(255,255,255,0.2)", color: "#fff" } : { background: "#f1f5f9", color: "#64748b" }}>{l.short}</span>
              </button>
            );
          })}
        </div>

        <DesktopPanel key={level.id} level={level} />

        <div ref={miniRef} className="desktop-only grid grid-cols-3 gap-3">
          {levels.map((l, i) => {
            const isA = l.id === active;
            const MiniIcon = l.icon;
            return (
              <button
                key={l.id}
                className={`mini-card text-left px-4 py-3.5 rounded-xl border bg-white cursor-pointer transition-all ${isA ? "shadow-md" : "shadow-xs hover:shadow-md"} ${miniIn ? "in-view-mini" : "opacity-0"}`}
                style={{ borderColor: isA ? l.color : "#e2e8f0", animationDelay: `${0.05 + i * 0.1}s` }}
                onClick={() => setActive(l.id)}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${l.color}10` }}>
                    <MiniIcon size={15} style={{ color: l.color }} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-brand-primary text-[13px] leading-tight truncate">{l.label}</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{l.range}</p>
                  </div>
                  {isA && (
                    <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: l.color }}>
                      <ChevronRight size={10} color="#fff" strokeWidth={3} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mobile-only flex flex-col gap-3 pb-4">
          {levels.map((l, i) => (
            <MobileCard key={l.id} level={l} index={i} isOpen={openMobile === l.id} onToggle={() => setOpenMobile(openMobile === l.id ? null : l.id)} />
          ))}
        </div>

      </div>
    </section>
  );
}