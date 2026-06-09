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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop Area Click to Close */}
      <div className="absolute inset-0" onClick={() => setSelectedNotice(null)} />
      
      {/* Modal Box Container */}
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl border border-slate-200 overflow-hidden relative z-10 animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded border ${selectedNotice.badgeColor}`}>
            {typeIcons[selectedNotice.type]}
            {selectedNotice.type} Notice
          </span>
          <button 
            onClick={() => setSelectedNotice(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors border-0 cursor-pointer bg-transparent"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Modal Body Contents */}
        <div className="p-5 sm:p-6 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {selectedNotice.title}
          </h2>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock3 size={13} className="text-slate-400" />
              Date of Issue: {selectedNotice.date}
            </span>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Detailed Information</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal bg-white">
              {selectedNotice.excerpt}
            </p>
          </div>
        </div>

        {/* Download Footer Links Action Panel */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex sm:justify-end">
          <a
            href={selectedNotice.link}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-emerald-700 text-xs font-bold shadow-md transition-all group no-underline"
          >
            <FileText size={14} />
            Download Official Document
            <ArrowUpRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

      </div>
    </div>
  );
}