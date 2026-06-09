import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface StreamCardProps {
  title: string;
  image: string;
  description: string;
  subjects: string[];
  careers: string[];
}

export default function StreamCard({ title, image, description, subjects, careers }: StreamCardProps) {
  return (
    <div className="max-w-6xl mx-auto bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm grid lg:grid-cols-[280px_1fr]">
      {/* IMAGE */}
      <div className="relative h-[130px] sm:h-[180px] lg:h-full min-h-[200px]">
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      </div>

      {/* CONTENT */}
      <div className="p-3 sm:p-5">
        {/* BADGE */}
        <span className="inline-flex px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700 text-[9px] font-bold tracking-[0.1em] uppercase">
          Academic Stream
        </span>

        {/* TITLE */}
        <h2 className="mt-1.5 text-[1.2rem] sm:text-[1.6rem] font-black text-slate-900 leading-tight">
          {title}
        </h2>

        {/* DESC */}
        <p className="mt-1.5 text-slate-600 leading-[1.6] text-[12px] sm:text-[14px]">
          {description}
        </p>

        {/* SUBJECTS + CAREERS */}
        <div className="grid sm:grid-cols-2 gap-2.5 mt-3">
          {/* SUBJECTS */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-900 mb-1.5 uppercase tracking-wide">
              Core Subjects
            </h3>
            <div className="space-y-1">
              {subjects.map((subject) => (
                <div key={subject} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50">
                  <CheckCircle2 size={11} className="text-cyan-500 shrink-0" />
                  <span className="text-[11px] font-medium text-slate-700 leading-tight">
                    {subject}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CAREERS */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-900 mb-1.5 uppercase tracking-wide">
              Careers
            </h3>
            <div className="flex flex-wrap gap-1">
              {careers.map((career) => (
                <span key={career} className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-semibold leading-tight">
                  {career}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <button className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-[12px] font-semibold transition-all duration-300 hover:translate-x-1 cursor-pointer border-0">
          Learn More
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}