'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Award } from "lucide-react";

export default function HighSchoolHero() {
  const router = useRouter();

  const images = [
    { src: "/assets/academics/high/medal_ceremony.jpg", title: "Medal Ceremony" },
    { src: "/assets/academics/high/students_bench.jpg", title: "Campus Life" },
    { src: "/assets/academics/high/bus_students.jpg", title: "School Transport" },
    { src: "/assets/academics/high/building.jpg", title: "Main Building" },
  ];

  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  const handleExploreClick = () => {
    const el = document.getElementById("modules-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      className="relative overflow-hidden min-h-[80vh] bg-gradient-to-br from-[#093C5D]/5 via-white to-slate-100 flex items-center border-b border-slate-200/60"
    >
      {/* Subtle Dot Grid pattern */}
      <div className="dot-grid absolute inset-0 opacity-20 pointer-events-none" />

      {/* Soft Glow Orbs for Light Theme */}
      <motion.div
        className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-[#FFC94D]/10 rounded-full blur-3xl top-[-50px] left-[-50px] pointer-events-none"
        animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] bg-cyan-400/5 rounded-full blur-3xl bottom-[-80px] right-[-80px] pointer-events-none"
        animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* MAIN CONTENT GRID */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT SIDE: TEXT CONTENT (Col-span 6 on desktop) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* BADGE */}
            <motion.span
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[#093C5D] text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase border border-[#093C5D]/15 bg-[#093C5D]/5 backdrop-blur-xs"
            >
              <Award size={12} className="text-[#FA6781]" />
              HPBOSE Affiliated
            </motion.span>

            {/* HEADING */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-[#06283D] font-black leading-[1.1] text-[2.1rem] xs:text-[2.4rem] sm:text-[3.2rem] md:text-[4rem] lg:text-[4.5rem]"
            >
              Future Ready<br />
              <span className="text-[#FA6781]">Classes 9 &amp; 10</span>
            </motion.h1>

            {/* LINE */}
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
              HPBOSE curriculum focused on concept clarity, board preparation, analytical thinking, and overall student development.
            </motion.p>

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
                Explore Academics
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/admissions")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-slate-700 font-bold text-sm transition-all duration-300 border border-slate-300 bg-white hover:bg-slate-50 cursor-pointer"
              >
                Admission Open
              </motion.button>
            </motion.div>
          </div>

          {/* RIGHT SIDE: LARGER IMAGE SLIDER (Col-span 6 on desktop) */}
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
                    alt={img.title}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  {/* Caption Overlay with Light/Dark contrast */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-5 pt-12 flex flex-col justify-end rounded-b-2xl">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#FFC94D]">{img.title}</span>
                    <p className="text-xs text-white/90 mt-0.5 font-medium">Classes IX &amp; X academic activities</p>
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