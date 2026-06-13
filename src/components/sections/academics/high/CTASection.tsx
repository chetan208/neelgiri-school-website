import React from "react";
import { ArrowRight, GraduationCap, BookOpen, Sparkles, Trophy, FlaskConical, Users } from "lucide-react";

export default function HighSchoolCTA() {
  return (
    <section className="py-10 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white border border-[#093C5D]/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* LEFT SIDE CONTENT */}
            <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
              <span className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-[#FFC94D] border border-[#093C5D]/20 text-[#093C5D] text-[10px] font-bold tracking-[2px] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#093C5D] animate-pulse" />
                Admissions Open
              </span>

              <h2 className="text-[1.7rem] sm:text-[2.2rem] md:text-[2.8rem] font-bold text-slate-800 mt-3 leading-[1.1]">
                Future Ready <span className="block text-[#093C5D] mt-0.5">Learning Environment</span>
              </h2>

              <p className="mt-3 text-slate-500 text-[13px] sm:text-sm leading-relaxed max-w-lg">
                Modern academics, smart classrooms, science labs, and technology-driven learning for Grades 6–10.
              </p>

              {/* MINI HIGHLIGHT CARDS */}
              <div className="grid grid-cols-3 gap-2 mt-5">
                <div className="bg-[#F8FAFC] border border-[#093C5D]/10 rounded-xl p-3 flex flex-col items-center text-center">
                  <GraduationCap size={18} className="text-[#59B292]" />
                  <h3 className="text-[11px] font-semibold text-slate-800 mt-2 leading-tight">Academic Growth</h3>
                </div>
                <div className="bg-[#F8FAFC] border border-[#093C5D]/10 rounded-xl p-3 flex flex-col items-center text-center">
                  <Sparkles size={18} className="text-[#FA6781]" />
                  <h3 className="text-[11px] font-semibold text-slate-800 mt-2 leading-tight">Creative Learning</h3>
                </div>
                <div className="bg-[#F8FAFC] border border-[#093C5D]/10 rounded-xl p-3 flex flex-col items-center text-center">
                  <BookOpen size={18} className="text-[#093C5D]" />
                  <h3 className="text-[11px] font-semibold text-slate-800 mt-2 leading-tight">Smart Education</h3>
                </div>
              </div>

              {/* ACTION CALL BUTTONS */}
              <div className="flex flex-wrap gap-2.5 mt-5">
                <button className="bg-[#FA6781] hover:bg-[#093C5D] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-md shadow-[#FA6781]/20 cursor-pointer">
                  Apply Now
                </button>
                <button className="flex items-center gap-1.5 border border-[#093C5D]/20 hover:border-[#093C5D] hover:text-[#093C5D] text-slate-600 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer bg-white">
                  Explore Campus <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* RIGHT GLASS SIDE PANEL */}
            <div className="relative hidden lg:block min-h-full bg-[#093C5D]">
              <img
                src="/assets/academics/high/admission_banner.jpg"
                alt="Neelgiri Public School high school students in chemistry laboratory"
                className="absolute inset-0 w-full h-full object-cover opacity-25"
              />
              <div className="relative z-10 h-full flex flex-col justify-center gap-3 p-7">
                <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy size={16} className="text-white/80" />
                    <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">Results</span>
                  </div>
                  <h3 className="text-3xl font-bold leading-none">98%</h3>
                  <p className="text-sm text-white/80 mt-0.5">Board Exam Results</p>
                </div>

                <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <FlaskConical size={16} className="text-white/80" />
                    <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">Labs</span>
                  </div>
                  <h3 className="text-3xl font-bold leading-none">25+</h3>
                  <p className="text-sm text-white/80 mt-0.5">Innovation & Science Labs</p>
                </div>

                <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={16} className="text-white/80" />
                    <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">Activities</span>
                  </div>
                  <h3 className="text-3xl font-bold leading-none">15+</h3>
                  <p className="text-sm text-white/80 mt-0.5">Clubs & Activities</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}