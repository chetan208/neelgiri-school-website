'use client';

import React from "react";
import { motion } from "framer-motion";

export default function AcademicsHero() {
  return (
    <section
      className="relative overflow-hidden min-h-[90svh] sm:min-h-screen"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* OVERLAYS */}
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />

      {/* GLOW ORBS */}
      <motion.div
        className="absolute w-[170px] h-[170px] sm:w-[260px] sm:h-[260px] md:w-[320px] md:h-[320px] bg-cyan-500/20 rounded-full blur-3xl top-0 left-[-40px]"
        animate={{ y: [0, 20, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-[220px] h-[220px] sm:w-[340px] sm:h-[340px] bg-blue-500/10 rounded-full blur-3xl bottom-[-60px] right-[-60px]"
        animate={{ y: [0, -25, 0], x: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto min-h-[90svh] sm:min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32">
        <div className="w-full max-w-3xl">
          {/* BADGE */}
          <motion.span
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-white text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase border border-white/20 mb-4 bg-white/5 backdrop-blur-md"
          >
            HPBOSE Affiliated
          </motion.span>

          {/* HEADING */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-white font-black leading-[0.98] text-[2.1rem] xs:text-[2.4rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.3rem]"
          >
            Excellence In<br />
            <span className="text-cyan-400">Classes 11 &amp; 12</span>
          </motion.h1>

          {/* LINE */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 75, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-1 rounded-full bg-cyan-400 mt-4"
          />

          {/* DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-4 text-white/75 leading-[1.75] text-[14px] sm:text-base md:text-lg max-w-2xl"
          >
            Our Senior Secondary program provides high-quality academic preparation for students of Classes 11 and 12 with expert faculty, modern learning methods, career-focused guidance, and strong conceptual understanding across Science, Commerce, and Humanities streams.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-full bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/30 cursor-pointer border-0"
            >
              Explore Streams
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-full text-white font-semibold border border-white/20 bg-white/5 backdrop-blur-md cursor-pointer"
            >
              Admission Enquiry
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}