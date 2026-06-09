import React from "react";
import { GraduationCap, Lightbulb, BookOpen, ArrowRight } from "lucide-react";

export default function SeniorSecondaryCTA() {
  return (
    <section className="w-full bg-gray-100 py-6 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl overflow-hidden shadow-md grid lg:grid-cols-2">
        {/* LEFT CONTENT */}
        <div className="p-5 sm:p-7 lg:p-8 flex flex-col justify-center">
          <span className="text-teal-700 tracking-[2.5px] text-[10px] font-semibold uppercase">
            Admissions Open
          </span>
          <h2 className="text-[1.6rem] sm:text-[2rem] lg:text-[2.4rem] font-bold text-slate-800 leading-tight mt-2">
            Future Focused <br />
            <span className="text-teal-700">Senior Secondary</span>
          </h2>
          <p className="text-slate-500 text-[13px] sm:text-sm leading-[1.65] mt-2.5 max-w-lg">
            Advanced academics, career-oriented learning, modern labs, and mentorship for Grades 11–12.
          </p>

          {/* FEATURE CARDS */}
          <div className="grid grid-cols-3 gap-2.5 mt-4">
            <div className="border border-slate-200 rounded-xl p-3 bg-white">
              <GraduationCap className="text-teal-700 w-5 h-5" />
              <p className="mt-2 font-semibold text-slate-800 text-[11px] sm:text-xs leading-tight">Career Guidance</p>
            </div>
            <div className="border border-slate-200 rounded-xl p-3 bg-white">
              <Lightbulb className="text-sky-500 w-5 h-5" />
              <p className="mt-2 font-semibold text-slate-800 text-[11px] sm:text-xs leading-tight">Advanced Learning</p>
            </div>
            <div className="border border-slate-200 rounded-xl p-3 bg-white">
              <BookOpen className="text-blue-600 w-5 h-5" />
              <p className="mt-2 font-semibold text-slate-800 text-[11px] sm:text-xs leading-tight">Competitive Prep</p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-2.5 mt-4">
            <button className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition cursor-pointer border-0">
              Apply Now
            </button>
            <button className="border border-slate-300 hover:bg-slate-100 text-slate-700 px-5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 cursor-pointer bg-white">
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
          <div className="absolute inset-0 bg-teal-700/70" />
          <div className="relative z-10 h-full flex flex-col justify-center gap-3 p-6 lg:p-8">
            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-4 text-white">
              <h3 className="text-2xl font-bold leading-tight">New</h3>
              <p className="text-sm mt-0.5">Senior Secondary Program</p>
            </div>
            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-4 text-white">
              <h3 className="text-xl font-bold leading-tight">Science &amp; Commerce</h3>
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