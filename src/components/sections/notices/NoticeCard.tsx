import React from 'react';
import { Clock3, FileText, X, ArrowUpRight } from "lucide-react";
import { NoticeType } from "./AllNoticesPage";

interface NoticeCardProps {
  selectedNotice: NoticeType;
  setSelectedNotice: (notice: NoticeType | null) => void;
  typeIcons: Record<string, React.ReactNode>;
}

export default function NoticeCard({ selectedNotice, setSelectedNotice, typeIcons }: NoticeCardProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06283D]/40 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop Area Click to Close */}
      <div className="absolute inset-0" onClick={() => setSelectedNotice(null)} />
      
      {/* Modal Box Container */}
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl border border-[#093C5D]/15 overflow-hidden relative z-10 animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-[#093C5D]/10 flex items-center justify-between bg-[#F8FAFC]">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded border ${selectedNotice.badgeColor}`}>
            {typeIcons[selectedNotice.type]}
            {selectedNotice.type} Notice
          </span>
          <button 
            onClick={() => setSelectedNotice(null)}
            className="p-1.5 rounded-lg text-[#06283D]/60 hover:text-[#093C5D] hover:bg-[#093C5D]/10 transition-colors border-0 cursor-pointer bg-transparent"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Modal Body Contents */}
        <div className="p-5 sm:p-6 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {selectedNotice.title}
          </h2>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#06283D]/70 bg-[#F8FAFC] p-2.5 rounded-lg border border-[#093C5D]/10">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock3 size={13} className="text-[#06283D]/60" />
              Date of Issue: {selectedNotice.date}
            </span>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#06283D]/60">Detailed Information</h4>
            <p className="text-xs sm:text-sm text-[#06283D]/80 leading-relaxed font-normal bg-white whitespace-pre-line">
              {selectedNotice.description || selectedNotice.excerpt}
            </p>
          </div>
        </div>

        {/* Download Footer Links Action Panel */}
        <div className="p-4 border-t border-[#093C5D]/10 bg-[#F8FAFC] flex sm:justify-end">
          {(selectedNotice.link === "custom:admissions" || selectedNotice.title.toLowerCase().includes("admission")) &&
           !selectedNotice.title.toLowerCase().includes("close") &&
           !selectedNotice.title.toLowerCase().includes("closed") ? (
            <a
              href="/admissions"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#093C5D] text-white hover:bg-[#FA6781] text-xs font-bold shadow-md transition-all group no-underline cursor-pointer"
            >
              <FileText size={14} />
              Apply Now
              <ArrowUpRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          ) : selectedNotice.link === "custom:calendar" || 
              selectedNotice.title.toLowerCase().includes("holiday") || 
              selectedNotice.title.toLowerCase().includes("exam") ||
              selectedNotice.title.toLowerCase().includes("calendar") ? (
            <a
              href="/academic-calendar"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#093C5D] text-white hover:bg-[#FA6781] text-xs font-bold shadow-md transition-all group no-underline cursor-pointer"
            >
              <FileText size={14} />
              View Academic Calendar
              <ArrowUpRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          ) : selectedNotice.link && selectedNotice.link !== "#" ? (
            <a
              href={selectedNotice.link}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#093C5D] text-white hover:bg-[#FA6781] text-xs font-bold shadow-md transition-all group no-underline cursor-pointer"
            >
              <FileText size={14} />
              Download Official Document
              <ArrowUpRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          ) : null}
        </div>

      </div>
    </div>
  );
}