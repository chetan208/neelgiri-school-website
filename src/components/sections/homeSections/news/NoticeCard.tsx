'use client';

import React from 'react';
import { Clock3, AlertTriangle, ShieldCheck, Briefcase, FileText, X, ArrowUpRight } from "lucide-react";

// TypeScript Interface declaration
interface NoticeDataType {
  type: string;
  badgeColor: string;
  title: string;
  date: string;
  excerpt: string;
  description?: string;
  link?: string;
}

interface NoticeCardProps {
  selectedNotice: NoticeDataType;
  setSelectedNotice: (notice: null | any) => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  Urgent: <AlertTriangle size={14} className="text-[#FA6781] shrink-0" />,
  Academic: <ShieldCheck size={14} className="text-[#093C5D] shrink-0" />,
  Careers: <Briefcase size={14} className="text-[#FFC94D] shrink-0" />,
};

export default function NoticeCard({ selectedNotice, setSelectedNotice }: NoticeCardProps) {
  const handleViewOrDownloadDocument = async (e: React.MouseEvent, fileUrl: string, title: string) => {
    e.preventDefault();
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const ext = fileUrl.split("?")[0].split(".").pop()?.toLowerCase() || "pdf";
      if (ext === "pdf" || ext === "jpg" || ext === "jpeg" || ext === "png") {
        window.open(blobUrl, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", `${title.replace(/[^a-zA-Z0-9]/g, "_")}.${ext}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  const isAdmissionOpenNotice = (selectedNotice.link === "custom:admissions" || 
                                 selectedNotice.title.toLowerCase().includes("admission")) &&
                                !selectedNotice.title.toLowerCase().includes("close") &&
                                !selectedNotice.title.toLowerCase().includes("closed");

  const isCalendarNotice = selectedNotice.link === "custom:calendar" || 
                           selectedNotice.title.toLowerCase().includes("holiday") || 
                           selectedNotice.title.toLowerCase().includes("exam") ||
                           selectedNotice.title.toLowerCase().includes("calendar");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06283D]/40 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop Click to Close */}
      <div className="absolute inset-0" onClick={() => setSelectedNotice(null)} />
      
      {/* Modal Box */}
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl border border-[#093C5D]/15 overflow-hidden relative z-10 animate-slideUp">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-[#093C5D]/10 flex items-center justify-between bg-[#F8FAFC]">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded border ${selectedNotice.badgeColor}`}>
            {typeIcons[selectedNotice.type] || <ShieldCheck size={14} className="text-[#093C5D] shrink-0" />}
            {selectedNotice.type} Notice
          </span>
          <button 
            onClick={() => setSelectedNotice(null)}
            className="p-1.5 rounded-lg text-[#06283D]/60 hover:text-[#093C5D] hover:bg-[#093C5D]/10 transition-colors border-0 cursor-pointer bg-transparent"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-[#093C5D] leading-snug">
            {selectedNotice.title}
          </h2>

          {/* Meta Rows */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#06283D]/70 bg-[#F8FAFC] p-2.5 rounded-lg border border-[#093C5D]/10">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock3 size={13} className="text-[#FA6781]" />
              Date: {selectedNotice.date}
            </span>
          </div>

          {/* Detailed Content */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#093C5D]">Detailed Information</h4>
            <p className="text-xs sm:text-sm text-[#06283D]/80 leading-relaxed font-normal bg-white whitespace-pre-line">
              {selectedNotice.description || selectedNotice.excerpt}
            </p>
          </div>
        </div>

        {/* Modal Footer Link */}
        <div className="p-4 border-t border-[#093C5D]/10 bg-[#F8FAFC] flex sm:justify-end">
          {isAdmissionOpenNotice ? (
            <a
              href="/admissions"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#093C5D] text-white hover:bg-[#FA6781] text-xs font-bold shadow-md transition-all group no-underline cursor-pointer"
            >
              <FileText size={14} />
              Apply Now
              <ArrowUpRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ml-1" />
            </a>
          ) : isCalendarNotice ? (
            <a
              href="/academic-calendar"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#093C5D] text-white hover:bg-[#FA6781] text-xs font-bold shadow-md transition-all group no-underline cursor-pointer"
            >
              <FileText size={14} />
              View Academic Calendar
              <ArrowUpRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ml-1" />
            </a>
          ) : selectedNotice.link && selectedNotice.link !== "#" ? (
            <button
              onClick={(e) => handleViewOrDownloadDocument(e, selectedNotice.link || "", selectedNotice.title)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#093C5D] text-white hover:bg-[#FA6781] text-xs font-bold shadow-md transition-all group border-0 cursor-pointer"
            >
              <FileText size={14} />
              View / Download Document
              <ArrowUpRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ml-1" />
            </button>
          ) : null}
        </div>

      </div>
    </div>
  );
}
