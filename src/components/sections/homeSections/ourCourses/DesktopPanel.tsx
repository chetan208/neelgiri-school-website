'use client';

import React from "react";
import { Star, ChevronRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useInView } from "./useInView";
import { LevelItem } from "./data";

export default function DesktopPanel({ level }: { level: LevelItem }) {
  const router = useRouter();
  const [panelRef, panelIn] = useInView();
  const [imgRef, imgIn]     = useInView();
  const [headRef, headIn]   = useInView();
  const [descRef, descIn]   = useInView();
  const [chipRef, chipIn]   = useInView();
  const [statRef, statIn]   = useInView();
  const [btnRef, btnIn]     = useInView();

  const LevelIcon = level.icon;

  return (
    <div
      ref={panelRef}
      className={`desktop-only flex rounded-2xl overflow-hidden border border-slate-200/80 bg-white ${
        panelIn ? "in-view-scale" : "opacity-0"
      }`}
      style={{
        boxShadow: "0 10px 30px -10px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.02)",
        animationDelay: "0.05s",
      }}
    >
      <div ref={imgRef} className="img-wrap relative w-[42%] shrink-0 overflow-hidden">
        <img src={level.image} alt={level.label} className={`w-full h-full object-cover ${imgIn ? "panel-img-enter" : ""}`} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(130deg,rgba(15,23,42,0.4) 0%,transparent 60%),linear-gradient(to top,rgba(15,23,42,0.5) 0%,transparent 45%)` }} />
        <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-md ${panelIn ? "in-view-slideL" : "opacity-0"}`} style={{ background: "rgba(15,23,42,0.25)", border: "1px solid rgba(255,255,255,0.15)", animationDelay: "0.35s" }}>
          <span className="w-[6px] h-[6px] rounded-full pulse-dot" style={{ background: level.color }} />
          {level.range}
        </div>
        <div className={`absolute bottom-4 left-4 right-4 flex items-end justify-between ${panelIn ? "in-view-up" : "opacity-0"}`} style={{ animationDelay: "0.45s" }}>
          <span className="px-2.5 py-1 rounded-lg text-white text-[11px] font-semibold" style={{ background: level.color }}>
            {level.age}
          </span>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} fill="#fbbf24" stroke="none" style={{ opacity: panelIn ? 1 : 0, transform: panelIn ? "scale(1)" : "scale(0)", transition: `all 0.3s cubic-bezier(.34,1.56,.64,1) ${0.5 + i * 0.06}s` }} />
            ))}
            <span className="text-white text-[11px] font-bold ml-1">5.0</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between flex-1 px-7 py-6 bg-white">
        <div>
          <div ref={headRef} className={`flex items-center gap-2.5 mb-3 ${headIn ? "in-view-slide" : "opacity-0"}`} style={{ animationDelay: "0.15s" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${level.color}10`, border: `1.5px solid ${level.color}25` }}>
              <LevelIcon size={17} style={{ color: level.color }} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: level.color }}>{level.label}</p>
              <p className="text-[10px] text-slate-400 font-medium">{level.range}</p>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0" style={{ background: level.tagBg, color: level.tagText }}>
              <Sparkles size={9} /> Featured
            </div>
          </div>

          <h3 ref={descRef} className={`serif text-[1.4rem] font-black text-brand-primary leading-snug mb-1.5 ${descIn ? "in-view-reveal" : "opacity-0"}`} style={{ animationDelay: "0.22s" }}>
            {level.headline}
          </h3>
          <p className={`text-brand-text-dark/80 text-[13px] leading-relaxed mb-4 ${descIn ? "in-view-up" : "opacity-0"}`} style={{ animationDelay: "0.32s" }}>
            {level.desc}
          </p>

          <div ref={chipRef}>
            <p className={`text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 ${chipIn ? "in-view-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
              Core Subjects
            </p>
            <div className="flex flex-wrap gap-1.5">
              {level.subjects.map((sub, i) => {
                const SubjectIcon = sub.icon;
                return (
                  <div key={i} className={`chip flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-50 border border-slate-200 text-slate-600 cursor-default ${chipIn ? "in-view-chip" : "opacity-0"}`} style={{ animationDelay: `${0.18 + i * 0.07}s` }}>
                    <SubjectIcon size={10} className="text-slate-400" strokeWidth={2.2} />
                    {sub.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div ref={statRef}>
          <div className={`grid grid-cols-3 rounded-xl overflow-hidden border border-slate-100 mb-4 ${statIn ? "in-view-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
            {level.stats.map((st, i) => {
              const StatIcon = st.icon;
              return (
                <div key={i} className={`flex flex-col items-center py-2 bg-slate-50/50 ${i < 2 ? "border-r border-slate-100" : ""} ${statIn ? "in-view-stat" : "opacity-0"}`} style={{ animationDelay: `${0.18 + i * 0.1}s` }}>
                  <StatIcon size={12} className="text-slate-400 mb-0.5" strokeWidth={2} />
                  <p className="text-sm font-black text-brand-primary leading-none">{st.value}</p>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide mt-0.5">{st.label}</p>
                </div>
              );
            })}
          </div>
          <div ref={btnRef} className={`flex gap-2 ${btnIn ? "in-view-up" : "opacity-0"}`} style={{ animationDelay: "0.12s" }}>
            <button 
              className="cta-btn flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-bold text-white border-0 cursor-pointer" 
              style={{ background: level.color, boxShadow: `0 4px 14px -2px ${level.color}40` }}
              onClick={() => router.push(level.path)}
            >
              Explore Programme <ChevronRight size={13} strokeWidth={2.5} />
            </button>
            <button className="cta-btn px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">
              Brochure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}