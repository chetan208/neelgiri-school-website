'use client';

import React from "react";
import { Baby, Pencil, BookOpen, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ClassModuleType {
  title: string;
  icon: React.ReactNode;
  image: string;
  description: string;
  skills: string[];
}

export default function LearningSpaces() {
  const classes: ClassModuleType[] = [
    {
      title: "Nursery & LKG",
      icon: <Baby size={22} />,
      image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1400&auto=format&fit=crop",
      description: "Fun-based learning with storytelling, phonics, rhymes, drawing, play activities, and social interaction.",
      skills: ["Alphabet & Numbers", "Rhymes & Storytelling", "Creative Play"],
    },
    {
      title: "UKG & Grade 1",
      icon: <Pencil size={22} />,
      image: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1400&auto=format&fit=crop",
      description: "Developing reading, writing, communication, and basic mathematics through engaging classroom activities.",
      skills: ["Reading & Writing", "Basic Mathematics", "Communication Skills"],
    },
    {
      title: "Grades 2 – 5",
      icon: <BookOpen size={22} />,
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1400&auto=format&fit=crop",
      description: "Strengthening academic foundations with science, mathematics, language learning, creativity, and teamwork.",
      skills: ["Science & EVS", "Problem Solving", "Creative Learning"],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="uppercase tracking-[4px] text-teal-700 text-sm font-semibold">
            Primary Learning Journey
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mt-3 leading-tight">
            Learning Designed <span className="block text-teal-700">For Every Stage</span>
          </h2>
          <p className="max-w-2xl mx-auto mt-5 text-slate-600 text-sm sm:text-base leading-relaxed">
            A joyful and engaging curriculum that builds confidence, creativity, communication, foundational literacy, and problem-solving skills from Nursery to Grade 5.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {classes.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group bg-white border border-slate-200 rounded-[28px] overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 cursor-pointer"
            >
              {/* Image Header */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>

                {/* Animated Icon */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center"
                >
                  {item.icon}
                </motion.div>

                {/* Title */}
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{item.description}</p>

                {/* Skills Badges */}
                <div className="flex flex-wrap gap-3 mt-6">
                  {item.skills.map((skill) => (
                    <div key={skill} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium">
                      {skill}
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex items-center gap-2 text-teal-700 font-semibold text-sm">
                  <Sparkles size={16} />
                  Interactive & Activity-Based Learning
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}