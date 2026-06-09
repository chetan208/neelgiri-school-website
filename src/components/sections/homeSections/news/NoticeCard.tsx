'use client';

import React from 'react';
import { Clock3, AlertTriangle, ShieldCheck, Briefcase, FileText, X } from "lucide-react";

// TypeScript Interface declaration
interface NoticeDataType {
  type: string;
  badgeColor: string;
  title: string;
  date: string;
  excerpt: string;
  link?: string;
}

interface NoticeCardProps {
  selectedNotice: NoticeDataType;
  setSelectedNotice: (notice: null | any) => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  Urgent: <AlertTriangle size={14} className="text-rose-600 shrink-0" />,
  Academic: <ShieldCheck size={14} className="text-blue-600 shrink-0" />,
  Careers: <Briefcase size={14} className="text-amber-600 shrink-0" />,
};

export default function NoticeCard({ selectedNotice, setSelectedNotice }: NoticeCardProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop Click to Close */}
      <div className="absolute inset-0" onClick={() => setSelectedNotice(null)} />
      
      {/* Modal Box */}
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl border border-slate-200 overflow-hidden relative z-10 animate-slideUp">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded border ${selectedNotice.badgeColor}`}>
            {typeIcons[selectedNotice.type] || <ShieldCheck size={14} className="text-slate-600 shrink-0" />}
            {selectedNotice.type} Notice
          </span>
          <button 
            onClick={() => setSelectedNotice(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {selectedNotice.title}
          </h2>

          {/* Meta Rows */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock3 size={13} className="text-slate-400" />
              Date: {selectedNotice.date}
            </span>
          </div>

          {/* Detailed Content */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Detailed Information</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal bg-white">
              {selectedNotice.excerpt}
            </p>
          </div>
        </div>

        {/* Modal Footer Link */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex sm:justify-end">
          <a
            href={selectedNotice.link || "#"}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-emerald-700 text-xs font-bold shadow-md transition-all group"
          >
            <FileText size={14} />
            Download Official Document
            <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
          </a>
        </div>

      </div>
    </div>
  );
}