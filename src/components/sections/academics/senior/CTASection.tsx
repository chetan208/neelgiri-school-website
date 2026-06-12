'use client';

import React from "react";
import { GraduationCap, Lightbulb, BookOpen, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SeniorSecondaryCTA() {
  const router = useRouter();

  return (
    <section className="w-full bg-[#F8FAFC] py-6 px-4">
      <div className="max-w-6xl mx-auto bg-white border border-[#093C5D]/15 rounded-2xl overflow-hidden shadow-md grid lg:grid-cols-2">
        {/* LEFT CONTENT */}
        <div className="p-5 sm:p-7 lg:p-8 flex flex-col justify-center">
          <span className="text-[#093C5D] tracking-[2.5px] text-[10px] font-bold uppercase">
            Admissions Open
          </span>
          <h2 className="text-[1.6rem] sm:text-[2rem] lg:text-[2.4rem] font-bold text-slate-800 leading-tight mt-2">
            Future Focused <br />
            <span className="text-[#093C5D]">Senior Secondary</span>
          </h2>
          <p className="text-slate-500 text-[13px] sm:text-sm leading-[1.65] mt-2.5 max-w-lg">
            Advanced academics, career-oriented learning, modern labs, and mentorship for Grades 11–12.
          </p>

          {/* FEATURE CARDS */}
          <div className="grid grid-cols-3 gap-2.5 mt-4">
            <div className="border border-[#093C5D]/20 rounded-xl p-3 bg-white">
              <GraduationCap className="text-[#093C5D] w-5 h-5" />
              <p className="mt-2 font-semibold text-slate-800 text-[11px] sm:text-xs leading-tight">Career Guidance</p>
            </div>
            <div className="border border-[#093C5D]/20 rounded-xl p-3 bg-white">
              <Lightbulb className="text-[#FFC94D] w-5 h-5" />
              <p className="mt-2 font-semibold text-slate-800 text-[11px] sm:text-xs leading-tight">Advanced Learning</p>
            </div>
            <div className="border border-[#093C5D]/20 rounded-xl p-3 bg-white">
              <BookOpen className="text-[#FA6781] w-5 h-5" />
              <p className="mt-2 font-semibold text-slate-800 text-[11px] sm:text-xs leading-tight">Competitive Prep</p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-2.5 mt-5">
            <button 
              onClick={() => router.push("/admissions")}
              className="bg-[#FA6781] hover:bg-[#093C5D] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border-0 shadow-sm shadow-[#FA6781]/15"
            >
              Apply Now
            </button>
            <button 
              onClick={() => router.push("/campus-tour")}
              className="border border-[#093C5D]/20 hover:border-[#093C5D] hover:text-[#093C5D] text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer bg-white"
            >
              Explore Campus
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          className="relative hidden lg:block min-h-[360px] bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-[#093C5D]/85" />
          <div className="relative z-10 h-full flex flex-col justify-center gap-3 p-6 lg:p-8">
            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-4 text-white">
              <h3 className="text-2xl font-bold leading-tight">New</h3>
              <p className="text-sm mt-0.5">Senior Secondary Program</p>
            </div>
            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-4 text-white">
              <h3 className="text-xl font-bold leading-tight">Medical &amp; Non-Medical</h3>
              <p className="text-sm mt-0.5">Streams Available</p>
            </div>
            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-4 text-white">
              <h3 className="text-xl font-bold leading-tight">Expert Faculty</h3>
              <p className="text-sm mt-0.5">Mentorship &amp; Career Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}