'use client';

import React from "react";
import { ArrowRight, Users, BookOpen, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function PrimaryCTASection() {
  return (
    <section className="py-10 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl sm:rounded-[32px] bg-white border border-[#093C5D]/20 shadow-xl"
        >
          {/* Top Decorative Gradient Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FA6781]" />

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT CONTENT */}
            <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
              
              {/* Badge */}
              <span className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-[#FFC94D] border border-[#093C5D]/20 text-[#093C5D] text-[10px] font-bold tracking-[2px] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#093C5D] animate-pulse" />
                Admissions Open
              </span>

              <h2 className="text-[1.7rem] sm:text-[2.2rem] md:text-[2.8rem] font-bold text-slate-800 mt-3 leading-[1.1]">
                Helping Children <span className="block text-[#093C5D] mt-0.5">Learn With Joy</span>
              </h2>

              <p className="mt-3 text-slate-500 text-[13px] sm:text-sm leading-relaxed max-w-lg">
                At Neelgiri Public School, young learners explore, create, and grow through engaging experiences designed for Nursery to Grade 5.
              </p>

              {/* Mini Stats Widgets */}
              <div className="flex flex-wrap gap-3 mt-5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#093C5D]/10">
                  <Users size={13} className="text-[#59B292]" />
                  <span className="text-[11px] font-semibold text-slate-700">500+ Students</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#093C5D]/10">
                  <BookOpen size={13} className="text-[#FA6781]" />
                  <span className="text-[11px] font-semibold text-slate-700">Activity Based</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#093C5D]/10">
                  <Star size={13} className="text-amber-500" />
                  <span className="text-[11px] font-semibold text-slate-700">HPBOSE Affiliated</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5 mt-5">
                <button className="bg-[#FA6781] hover:bg-[#093C5D] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition duration-300 shadow-md shadow-[#FA6781]/20 cursor-pointer">
                  Apply For Admission
                </button>
                <button className="flex items-center gap-1.5 border border-[#093C5D]/20 hover:border-[#093C5D] hover:text-[#093C5D] text-slate-600 px-5 py-2.5 rounded-xl text-sm font-semibold transition duration-300 cursor-pointer bg-white">
                  Explore Programs
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* RIGHT IMAGE PANEL */}
            <div className="relative hidden lg:block min-h-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop"
                alt="Primary Students"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />

              {/* Floating Dynamic Badge Card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute bottom-6 left-5 right-5 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/60"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFC94D] border border-[#093C5D]/20 flex items-center justify-center shrink-0">
                    <BookOpen size={16} className="text-[#093C5D]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-800 leading-tight">
                      Activity Based Learning
                    </h3>
                    <p className="text-slate-500 text-[12px] mt-1 leading-relaxed">
                      Encouraging creativity, teamwork, and foundational skills through interactive classroom activities.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}