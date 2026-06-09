import React from "react";
import { BookOpen } from "lucide-react";
import { PaperType } from "../../../../app/prevous-years-papers/page";


interface SubjectSelectionProps {
  papers: PaperType[];
  onSelectSubject: (sub: string) => void;
}

export default function SubjectSelection({ papers, onSelectSubject }: SubjectSelectionProps) {
  const availableSubjects = Array.from(
    new Set(papers.map((paper) => paper.subject?.toLowerCase()))
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs animate-in fade-in duration-200">
      <div className="mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <BookOpen size={14} />
        </div>
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Subjects</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Select a subject below to look at its collection of past papers.</p>
        </div>
      </div>

      {availableSubjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableSubjects.map((sub) => (
            <button
              key={sub}
              onClick={() => onSelectSubject(sub)}
              className="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-slate-100/50 rounded-xl text-left font-bold text-slate-700 transition-all flex items-center justify-between capitalize cursor-pointer text-sm group"
            >
              <span>{sub}</span>
              <span className="text-[10px] text-slate-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Explore &rarr;
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic py-4 text-center">No subjects available for this section.</p>
      )}
    </div>
  );
}