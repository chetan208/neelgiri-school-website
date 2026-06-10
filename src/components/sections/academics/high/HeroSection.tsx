'use client';

import React from "react";
import { ArrowRight, Award, BookOpen, FlaskConical, MonitorSmartphone } from "lucide-react";
import { motion } from "framer-motion";

export default function HighSchoolHero() {
  return (
    <section className="relative h-[calc(100vh-80px)] min-h-[560px] max-h-[760px] overflow-hidden">
      {/* Background Image */}
      <motion.img
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop"
        alt="Students collaborating"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-900/40"></div>

      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FFC94D]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>

      {/* Floating Blur Orb */}
      <motion.div
        animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-32 h-32 bg-[#FFC94D]/20 rounded-full blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 h-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center">
          <div className="max-w-3xl">
            
            {/* HPBOSE Badge */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 mb-5 shadow-2xl"
            >
              <Award size={16} className="text-[#FFC94D]" />
              <span className="text-xs sm:text-sm text-slate-100 font-medium">
                Affiliated to <span className="text-[#FFC94D] font-bold">HPBOSE</span>
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 45 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05]"
            >
              Preparing Students
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="block text-[#FFC94D]"
              >
                For Future Success
              </motion.span>
              <span className="block mt-2 text-white">
                at <span className="text-[#FFC94D]">Neelgiri Public School</span>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-5 text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed max-w-2xl"
            >
              A modern learning environment focused on science, technology, creativity, leadership, and critical thinking for students from Grades 6–10.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-3 mt-6"
            >
              {[
                { icon: <BookOpen size={16} />, title: "Smart Classes" },
                { icon: <FlaskConical size={16} />, title: "Science Labs" },
                { icon: <MonitorSmartphone size={16} />, title: "Digital Learning" },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ y: -4, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 250 }}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl shadow-xl"
                >
                  <div className="text-[#FFC94D]">{item.icon}</div>
                  <span className="text-white text-xs sm:text-sm">{item.title}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap gap-4 mt-7"
            >
              <button className="bg-[#FFC94D] hover:bg-[#093C5D] text-[#093C5D] hover:text-white px-6 py-3 rounded-xl text-sm sm:text-base font-semibold transition duration-300 shadow-[0_0_30px_rgba(213,176,108,0.35)] cursor-pointer">
                Admission Open
              </button>
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white px-6 py-3 rounded-xl text-sm sm:text-base font-semibold transition duration-300 cursor-pointer">
                Explore Academics
                <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-transparent"></div>
    </section>
  );
}