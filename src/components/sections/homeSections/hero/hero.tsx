'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Award, GraduationCap, Trophy, BookOpen, ArrowRight } from "lucide-react";

const images = [
  { src: "/assets/home/hero_slide1.png", title: "School Campus" },
  { src: "/assets/home/hero_slide2.png", title: "Academic Excellence" },
  { src: "/assets/home/hero_slide3.png", title: "Holistic Growth" },
];

export default function HeroSection() {
  const router = useRouter();
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleExploreClick = () => {
    const el = document.getElementById("our-courses");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      className="relative overflow-hidden min-h-[85vh] bg-gradient-to-br from-[#093C5D]/5 via-white to-slate-100 flex items-center border-b border-slate-200/60"
    >
      {/* Subtle Dot Grid pattern */}
      <div className="dot-grid absolute inset-0 opacity-20 pointer-events-none" />

      {/* Soft Glow Orbs */}
      <motion.div
        className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-cyan-400/10 rounded-full blur-3xl top-[-50px] left-[-50px] pointer-events-none"
        animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] bg-emerald-400/5 rounded-full blur-3xl bottom-[-80px] right-[-80px] pointer-events-none"
        animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* MAIN CONTENT GRID */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT SIDE: TEXT CONTENT */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* BADGE */}
            <motion.span
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[#093C5D] text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase border border-[#093C5D]/15 bg-[#093C5D]/5 backdrop-blur-xs"
            >
              <Award size={12} className="text-[#FA6781]" />
              Est. 1988 &middot; HPBOSE Affiliated
            </motion.span>

            {/* HEADING */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-[#06283D] font-black leading-[1.05] text-[2.1rem] xs:text-[2.4rem] sm:text-[3.2rem] md:text-[4rem] lg:text-[4.5rem]"
            >
              Empowering<br />
              <span className="text-[#FA6781]">Young Minds</span>
            </motion.h1>

            {/* ACCENT LINE */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 75, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-1 rounded-full bg-[#FA6781] mt-3"
            />

            {/* DESCRIPTION */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-4 text-slate-600 leading-[1.7] text-[14px] sm:text-base md:text-lg max-w-xl"
            >
              Neelgiri Public School, Hatwas &ndash; Nagrota Bagwan, provides high-quality education from Nursery to Class 12 with expert faculty, modern labs, and a campus built for holistic growth.
            </motion.p>

            {/* Feature Pills — Lucide icons, no emojis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap gap-2.5 mt-4"
            >
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
                <GraduationCap size={14} className="text-[#093C5D]" />
                <span className="text-slate-700 text-xs font-semibold">Nursery to 12th</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
                <Trophy size={14} className="text-[#FFC94D]" />
                <span className="text-slate-700 text-xs font-semibold">38+ Years</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
                <BookOpen size={14} className="text-[#59B292]" />
                <span className="text-slate-700 text-xs font-semibold">HPBOSE Board</span>
              </div>
            </motion.div>

            {/* BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 mt-6"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleExploreClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#093C5D] hover:bg-[#FA6781] text-white font-bold text-sm transition-all duration-300 cursor-pointer border-0 shadow-md shadow-[#093C5D]/15"
              >
                Explore Programs
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/admissions")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-slate-700 font-bold text-sm transition-all duration-300 border border-slate-300 bg-white hover:bg-slate-50 cursor-pointer"
              >
                Apply for Admission
                <ArrowRight size={15} />
              </motion.button>
            </motion.div>
          </div>

          {/* RIGHT SIDE: IMAGE SLIDER */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-6 flex justify-center w-full"
          >
            <div className="relative w-full max-w-[550px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white p-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-2 transition-all duration-700 ease-in-out transform ${
                    idx === imgIndex ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <img
                    src={img.src}
                    alt={`Neelgiri Public School – ${img.title}`}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  {/* Caption Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-5 pt-12 flex flex-col justify-end rounded-b-2xl">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#FFC94D]">{img.title}</span>
                    <p className="text-xs text-white/90 mt-0.5 font-medium">Neelgiri Public School, Hatwas</p>
                  </div>
                </div>
              ))}
              
              {/* Dots indicator */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10 bg-black/40 backdrop-blur-sm px-3.5 py-2 rounded-full">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImgIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 border-0 cursor-pointer ${
                      idx === imgIndex ? "bg-[#FA6781] w-4" : "bg-white/60"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
