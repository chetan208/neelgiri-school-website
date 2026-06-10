'use client';

import React from "react";
import { Dna, FlaskConical, Calculator, MonitorSmartphone, Globe2, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ModuleType {
  title: string;
  icon1: React.ReactNode;
  icon2: React.ReactNode;
  image: string;
  description: string;
  points: string[];
}

export default function AcademicModules() {
  const modules: ModuleType[] = [
    {
      title: "Integrated Sciences",
      icon1: <Dna size={22} />,
      icon2: <FlaskConical size={22} />,
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop",
      description: "Physics, Chemistry, and Biology taught through experiments, lab activities, and scientific exploration.",
      points: ["Human Body & Genetics", "Electricity & Motion", "Lab-Based Learning"],
    },
    {
      title: "Mathematics & Technology",
      icon1: <Calculator size={22} />,
      icon2: <MonitorSmartphone size={22} />,
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
      description: "Building logical thinking, problem-solving, coding fundamentals, and advanced mathematics skills.",
      points: ["Algebra & Geometry", "Coding Fundamentals", "Analytical Thinking"],
    },
    {
      title: "Humanities & Languages",
      icon1: <Globe2 size={22} />,
      icon2: <BookOpen size={22} />,
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
      description: "Strengthening communication, creativity, cultural understanding, and leadership abilities.",
      points: ["History & Civics", "Creative Writing", "Public Speaking"],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="uppercase tracking-[4px] text-[#093C5D] text-sm font-semibold">
            Academic Excellence
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#06283D] mt-3 leading-tight">
            Future Focused <span className="block text-[#093C5D]">Learning Programs</span>
          </h2>
          <p className="max-w-2xl mx-auto mt-5 text-[#06283D]/70 text-sm sm:text-base leading-relaxed">
            Designed to develop analytical thinking, creativity, scientific understanding, communication, and technology-driven learning.
          </p>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {modules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative bg-white border border-[#093C5D]/20 rounded-[28px] overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 cursor-pointer"
            >
              {/* Top Image */}
              <div className="relative overflow-hidden h-56">
                <img
                  src={module.image}
                  alt={module.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>

                {/* Floating Icons */}
                <div className="absolute top-4 left-4 flex gap-3">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center"
                  >
                    {module.icon1}
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center"
                  >
                    {module.icon2}
                  </motion.div>
                </div>

                {/* Title */}
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="text-2xl font-bold text-white leading-tight">{module.title}</h3>
                </div>
              </div>

              {/* Content Box */}
              <div className="p-6">
                <p className="text-[#06283D]/70 text-sm sm:text-base leading-relaxed">{module.description}</p>

                {/* Skills/Points */}
                <div className="flex flex-wrap gap-3 mt-6">
                  {module.points.map((point) => (
                    <div key={point} className="bg-[#F8FAFC] text-[#06283D] px-4 py-2 rounded-xl text-sm font-medium border border-[#093C5D]/10">
                      {point}
                    </div>
                  ))}
                </div>

                {/* Card Bottom Panel */}
                <div className="mt-7 flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#FFC94D] text-[#093C5D] flex items-center justify-center">
                    <ArrowRight size={18} />
                  </div>
                  <span className="text-sm font-semibold text-[#093C5D]">Grades 6–10</span>
                </div>
              </div>

              {/* Shimmer Ambient Light */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#59B292]/10 rounded-full blur-3xl"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}