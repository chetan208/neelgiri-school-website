'use client';

import React, { useRef, useEffect } from "react";
import { Star, ChevronRight, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useInView } from "./useInView";
import { LevelItem } from "./data";

interface MobileCardProps {
  level: LevelItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

export default function MobileCard({ level, isOpen, onToggle, index }: MobileCardProps) {
  const router = useRouter();
  const [cardRef, cardIn] = useInView();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    if (isOpen && scrollRef.current) {
      setTimeout(() => {
        const y = scrollRef.current!.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 100);
    }
  }, [isOpen]);

  const LevelIcon = level.icon;

  return (
    <div
      ref={(el) => { 
        if (cardRef) (cardRef as any).current = el; 
        scrollRef.current = el; 
      }}
      className={`mobile-only rounded-2xl overflow-hidden border bg-white shadow-sm ${cardIn ? "in-view-mobile" : "opacity-0"}`}
      style={{ borderColor: isOpen ? level.color : "#e2e8f0", animationDelay: `${index * 0.12}s` }}
    >
      <button className="w-full flex items-center gap-3 px-4 py-4 border-0 cursor-pointer text-left bg-white" onClick={onToggle}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${level.color}10`, border: `1.5px solid ${level.color}20` }}>
          <LevelIcon size={18} style={{ color: level.color }} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-brand-primary text-[14px] leading-tight">{level.label}</p>
          <p className="text-[11px] text-slate-400 font-medium">{level.range}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: level.tagBg, color: level.tagText }}>{level.age}</span>
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: isOpen ? level.color : "#f1f5f9", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.3s cubic-bezier(.22,1,.36,1), background 0.2s" }}>
            <ChevronRight size={13} color={isOpen ? "#fff" : "#94a3b8"} strokeWidth={2.5} />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="fade-slide border-t border-slate-100">
          <div className="relative h-44 overflow-hidden">
            <img src={level.image} alt={level.label} className="w-full h-full object-cover panel-img-enter" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to top,rgba(15,23,42,.5) 0%,transparent 50%)` }} />
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
              <span className="px-2.5 py-1 rounded-lg text-white text-[11px] font-semibold" style={{ background: level.color }}>{level.age}</span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#fbbf24" stroke="none" />)}
                <span className="text-white text-[10px] font-bold ml-1">5.0</span>
              </div>
            </div>
          </div>
          <div className="px-4 pb-4 pt-4 bg-white">
            <h4 className="serif text-[1.15rem] font-black text-brand-primary leading-snug mb-1">{level.headline}</h4>
            <p className="text-brand-text-dark/80 text-[13px] leading-relaxed mb-4">{level.desc}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {level.subjects.map((sub, i) => {
                const SubjectIcon = sub.icon;
                return (
                  <div key={i} className="in-view-chip flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-50 border border-slate-200 text-slate-600" style={{ animationDelay: `${i * 0.06}s` }}>
                    <SubjectIcon size={10} className="text-slate-400" strokeWidth={2.2} /> {sub.label}
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-3 rounded-xl overflow-hidden border border-slate-100 mb-4">
              {level.stats.map((st, i) => {
                const StatIcon = st.icon;
                return (
                  <div key={i} className={`in-view-stat flex flex-col items-center py-2.5 bg-slate-50/50 ${i < 2 ? "border-r border-slate-100" : ""}`} style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                    <StatIcon size={12} className="text-slate-400 mb-0.5" strokeWidth={2} />
                    <p className="text-[13px] font-black text-brand-primary leading-none">{st.value}</p>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide mt-0.5">{st.label}</p>
                  </div>
                );
              })}
            </div>
            <button 
              className="cta-btn w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold text-white border-0 cursor-pointer" 
              style={{ background: level.color, boxShadow: `0 4px 12px ${level.color}30` }}
              onClick={() => router.push(level.path)}
            >
              Explore Programme <ArrowUpRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}