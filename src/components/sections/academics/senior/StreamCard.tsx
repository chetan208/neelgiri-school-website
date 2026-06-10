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
    <div className="max-w-6xl mx-auto bg-white border border-[#093C5D]/20 rounded-2xl overflow-hidden shadow-sm grid lg:grid-cols-[280px_1fr]">
      {/* IMAGE */}
      <div className="relative h-[130px] sm:h-[180px] lg:h-full min-h-[200px]">
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      </div>

      {/* CONTENT */}
      <div className="p-3 sm:p-5">
        {/* BADGE */}
        <span className="inline-flex px-2.5 py-0.5 rounded-full bg-[#FFC94D] text-[#093C5D] text-[9px] font-bold tracking-[0.1em] uppercase">
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
                <div key={subject} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#093C5D]/5">
                  <CheckCircle2 size={11} className="text-[#59B292] shrink-0" />
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
                <span key={career} className="px-2 py-0.5 rounded-full bg-[#093C5D]/10 text-[#093C5D] text-[10px] font-semibold leading-tight">
                  {career}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <button className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FA6781] hover:bg-[#093C5D] text-white text-[12px] font-bold transition-all duration-300 hover:translate-x-1 cursor-pointer border-0 shadow-sm shadow-[#FA6781]/10">
          Learn More
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}