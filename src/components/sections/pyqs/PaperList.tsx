import React from "react";
import { Calendar, FileDown, Files } from "lucide-react";
import { PaperType } from "../../../../app/prevous-years-papers/page";

interface PaperListProps {
  selectedSubject: string;
  papers: PaperType[];
}

export default function PaperList({ selectedSubject, papers }: PaperListProps) {
  const finalPapersList = papers
    .filter((paper) => paper.subject?.toLowerCase() === selectedSubject?.toLowerCase())
    .sort((a, b) => b.year.localeCompare(a.year));

  const handleDownloadForce = async (e: React.MouseEvent, fileUrl: string) => {
    e.stopPropagation();
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileUrl.split("/").pop() || "paper.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs animate-in fade-in duration-200">
      <div className="mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <Files size={14} />
        </div>
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider capitalize">{selectedSubject} Papers</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Click on a card to view the file or use the icon to save it directly.</p>
        </div>
      </div>

      <div className="space-y-2">
        {finalPapersList.length > 0 ? (
          finalPapersList.map((paper) => (
            <div
              key={paper.id}
              onClick={() => window.open(paper.fileUrl, "_blank", "noopener,noreferrer")}
              className="p-3.5 bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100/40 rounded-xl flex items-center justify-between gap-4 transition-all cursor-pointer shadow-3xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="shrink-0 bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <Calendar size={11} /> {paper.year}
                </span>
                <span className="text-slate-700 text-xs font-bold capitalize truncate">{paper.term}</span>
              </div>

              <button
                onClick={(e) => handleDownloadForce(e, paper.fileUrl)}
                className="h-9 w-9 bg-white border border-slate-200 hover:bg-slate-800 hover:border-slate-800 text-slate-500 hover:text-white flex items-center justify-center rounded-lg transition-all shadow-3xs cursor-pointer shrink-0"
              >
                <FileDown size={15} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 italic py-4 text-center">No sheets found for this topic.</p>
        )}
      </div>
    </div>
  );
}