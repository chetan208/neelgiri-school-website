'use client';

import React from "react";
import { ArrowRight, Award, BookOpen, Palette, Puzzle } from "lucide-react";
import { motion } from "framer-motion";

export default function PrimaryHeroSection() {
  return (
    <section className="relative h-[calc(100vh-80px)] min-h-[560px] max-h-[760px] overflow-hidden">
      {/* Background Image */}
      <motion.img
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
        src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2000&auto=format&fit=crop"
        alt="Primary school students"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-slate-900/40"></div>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>

      {/* Content */}
      <div className="relative z-10 h-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center">
          <div className="max-w-3xl">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 mb-5"
            >
              <Award size={16} className="text-teal-300" />
              <span className="text-xs sm:text-sm text-slate-100 font-medium">
                Affiliated to <span className="text-teal-300 font-bold">HPBOSE</span>
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05]"
            >
              Inspiring Young Minds
              <span className="block text-teal-300">Through Creative</span>
              <span className="block mt-2 text-white">
                Learning at <span className="text-teal-300">Neelgiri Public School</span>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-5 text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed max-w-2xl"
            >
              Building strong foundations through activity-based learning, creativity, communication, curiosity, and joyful classroom experiences for Primary Years 1–5.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-3 mt-6"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
                <BookOpen size={16} className="text-teal-300" />
                <span className="text-white text-xs sm:text-sm">Interactive Learning</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
                <Palette size={16} className="text-teal-300" />
                <span className="text-white text-xs sm:text-sm">Creative Activities</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
                <Puzzle size={16} className="text-teal-300" />
                <span className="text-white text-xs sm:text-sm">Fun Problem Solving</span>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 mt-7"
            >
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl text-sm sm:text-base font-semibold transition duration-300 shadow-lg cursor-pointer">
                Explore Primary Years
              </button>
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white px-6 py-3 rounded-xl text-sm sm:text-base font-semibold transition duration-300 cursor-pointer">
                Take Virtual Tour
                <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 to-transparent"></div>
    </section>
  );
}