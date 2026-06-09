import React from "react";
import { Quote } from "lucide-react";
import { FacultyType } from "./PrincipalCard";

export default function TeacherCard({ teacher }: { teacher: FacultyType }) {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
      {/* IMAGE CONTAINER */}
      <div className="relative bg-slate-50 flex items-center justify-center p-2 h-[160px] sm:h-[200px]">
        <img
          src={teacher.imageUrl || "https://picsum.photos/seed/teacher/300/300"}
          alt={teacher.name}
          className="max-w-full max-h-full object-contain rounded-xl"
        />
      </div>

      {/* CONTENT */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between gap-2">
        <div>
          {/* NAME & SUBJECT BADGE */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[14px] sm:text-base font-bold text-slate-800 leading-tight capitalize truncate">
              {teacher.name}
            </h3>
            
            <span className="shrink-0 inline-flex px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] sm:text-[10px] font-medium whitespace-nowrap">
              {teacher.subject}
            </span>
          </div>

          {/* BIO / QUOTE */}
          {teacher.bio && (
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-start gap-1.5">
              <Quote size={11} className="text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-slate-500 text-[10px] sm:text-[12px] italic leading-relaxed line-clamp-2">
                {teacher.bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}