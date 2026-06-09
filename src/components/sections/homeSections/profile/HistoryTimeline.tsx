'use client';

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionLabel from "./SectionLabel";
import { timeline, colorMap } from "./constants";

export default function HistoryTimeline() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14 border-b border-slate-100 pb-8">
        <div className="space-y-2">
          <SectionLabel>Our Story</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-serif">
            History &amp;{" "}
            <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-teal-400 bg-clip-text text-transparent">
              Heritage
            </span>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-slate-500 leading-relaxed">
          From a small community school to a celebrated institution — every milestone shaped us.
        </p>
      </div>

      <div className="relative px-2 sm:px-6" ref={containerRef}>
        <div className="absolute left-4 md:left-1/2 top-1 bottom-1 w-[2px] bg-slate-200 -translate-x-1/2 z-0" />
        
        <motion.div
          className="absolute left-4 md:left-1/2 top-1 bottom-1 w-[2px] bg-teal-500 -translate-x-1/2 z-10 origin-top"
          style={{ scaleY }}
        />

        <div className="space-y-8 md:space-y-6">
          {timeline.map(({ year, icon: Icon, color, title, tag, desc }, i) => {
            const isEven = i % 2 === 0;
            const c = colorMap[color] || {
              dot: "bg-slate-400",
              border: "border-slate-200",
              icon: "bg-slate-100 text-slate-600",
              tag: "bg-slate-100 text-slate-600",
            };

            const syncViewport = { once: false, margin: "0px 0px -50% 0px" };

            return (
              <div
                key={i}
                className="relative flex flex-col pl-10 md:pl-0 md:grid md:grid-cols-2 md:gap-10 items-center group"
              >
                <motion.div
                  initial={{ scale: 0.8, backgroundColor: "#e2e8f0" }}
                  whileInView={{ scale: 1.25, backgroundColor: "#14b8a6" }}
                  viewport={syncViewport}
                  transition={{ duration: 0.3 }}
                  className="absolute left-4 md:left-1/2 top-3 md:top-1/2 w-3.5 h-3.5 rounded-full ring-4 ring-white shadow-sm z-20 -translate-y-1/2 -translate-x-1/2"
                >
                  <span className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 group-hover:animate-ping ${c.dot}`} />
                </motion.div>

                <div className={`mb-1 md:mb-0 z-10 select-none ${isEven ? "md:col-start-2 md:text-left md:pl-8" : "md:col-start-1 md:text-right md:pr-8"}`}>
                  <motion.span 
                    initial={{ color: "#cbd5e1" }}
                    whileInView={{ color: "#14b8a6" }}
                    viewport={syncViewport}
                    transition={{ duration: 0.3 }}
                    className="text-xl md:text-2xl font-black font-serif tracking-tight"
                  >
                    {year}
                  </motion.span>
                </div>

                <motion.div
                  initial={{ 
                    borderColor: "rgba(226, 232, 240, 0.8)", 
                    boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
                    opacity: 0.4,
                    filter: "grayscale(100%)",
                    y: 24 
                  }}
                  whileInView={{ 
                    borderColor: "#14b8a6",
                    boxShadow: "0 8px 28px -6px rgba(20, 184, 166, 0.15)",
                    opacity: 1,
                    filter: "grayscale(0%)",
                    y: 0
                  }}
                  viewport={syncViewport}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className={`w-full bg-white rounded-2xl border p-5 z-10 transition-transform duration-300 ease-out hover:-translate-y-1 ${isEven ? "md:col-start-1 md:row-start-1" : "md:col-start-2"}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${c.icon}`}>
                      <Icon className="w-[18px] h-[18px]" />
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <h4 className="font-bold text-slate-800 text-sm tracking-tight leading-none">
                          {title}
                        </h4>
                        <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${c.tag}`}>
                          {tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}