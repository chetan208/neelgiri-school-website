import React from "react";
import { GraduationCap, Quote } from "lucide-react";

// TypeScript specifications define ki
export interface FacultyType {
  name: string;
  email: string;
  subject: string;
  bio?: string;
  imageUrl: string;
  isPrincipal: boolean;
}

export default function PrincipalCard({ principal }: { principal: FacultyType }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] max-w-5xl mx-auto">
      {/* TOP DECORATIVE LINE */}
      <div className="h-[4px] w-full bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500" />

      {/* GRID SYSTEM: Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr] items-center">
        {/* IMAGE CONTAINER */}
        <div className="bg-slate-50 w-full h-[240px] sm:h-[300px] md:h-full flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-100">
          <img
            src={principal.imageUrl || "https://picsum.photos/seed/principal/400/400"}
            alt={principal.name}
            className="max-w-full max-h-full object-contain rounded-xl"
          />
        </div>

        {/* CONTENT SIDE */}
        <div className="p-5 sm:p-8 lg:p-10 flex flex-col justify-center">
          {/* BADGE */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
              <GraduationCap size={12} />
              Principal
            </span>
          </div>

          {/* NAME */}
          <h3 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 leading-tight capitalize">
            {principal.name}
          </h3>

          {/* SUBJECT */}
          <p className="mt-1.5 text-cyan-600 text-sm sm:text-base font-semibold">
            {principal.subject}
          </p>

          {/* BIO / QUOTE BOX */}
          {principal.bio && (
            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-cyan-100/70 flex items-center justify-center">
                  <Quote size={14} className="text-cyan-700" />
                </div>
                <p className="text-slate-600 text-[12px] sm:text-[14px] italic leading-relaxed">
                  {principal.bio}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}