'use client';

import React from "react";
import { Baby, Pencil, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface ClassModuleType {
  title: string;
  icon: React.ReactNode;
  image: string;
  description: string;
  skills: string[];
}

export default function LearningSpaces() {
  const router = useRouter();

  const classes: ClassModuleType[] = [
    {
      title: "Nursery & LKG",
      icon: <Baby size={22} />,
      image: "/assets/academics/primary/primary_kids_krishna.jpg",
      description: "Fun-based learning with storytelling, phonics, rhymes, drawing, play activities, and social interaction.",
      skills: ["Alphabet & Numbers", "Rhymes & Storytelling", "Creative Play"],
    },
    {
      title: "UKG & Grade 1",
      icon: <Pencil size={22} />,
      image: "/assets/academics/primary/primary_students_statue.jpg",
      description: "Developing reading, writing, communication, and basic mathematics through engaging classroom activities.",
      skills: ["Reading & Writing", "Basic Mathematics", "Communication Skills"],
    },
    {
      title: "Grades 2 – 5",
      icon: <BookOpen size={22} />,
      image: "/assets/academics/primary/primary_students_science.jpg",
      description: "Strengthening academic foundations with science, mathematics, language learning, creativity, and teamwork.",
      skills: ["Science & EVS", "Problem Solving", "Creative Learning"],
    },
  ];

  return (
    <section id="modules-section" className="py-16 md:py-24 bg-[#F8FAFC] overflow-hidden scroll-mt-20">
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
            Primary Learning Journey
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#06283D] mt-3 leading-tight">
            Learning Designed <span className="block text-[#093C5D]">For Every Stage</span>
          </h2>
          <p className="max-w-2xl mx-auto mt-5 text-[#06283D]/70 text-sm sm:text-base leading-relaxed">
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
              className="group bg-white border border-[#093C5D]/20 rounded-[28px] overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 cursor-pointer flex flex-col justify-between"
            >
              {/* Top Section */}
              <div className="flex flex-col">
                {/* Image Header */}
                <div className="relative h-56 overflow-hidden w-full">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
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
                  <p className="text-[#06283D]/70 text-sm sm:text-base leading-relaxed">{item.description}</p>

                  {/* Skills Badges */}
                  <div className="flex flex-wrap gap-2.5 mt-5">
                    {item.skills.map((skill) => (
                      <div key={skill} className="bg-[#F8FAFC] text-[#06283D] px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-[#093C5D]/10">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons Section at Bottom */}
              <div className="p-6 pt-0 mt-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/admissions");
                  }}
                  className="w-full flex items-center justify-center gap-1.5 bg-[#FA6781] hover:bg-[#093C5D] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition border-0 shadow-sm shadow-[#FA6781]/15 cursor-pointer"
                >
                  Apply for Admission
                  <ArrowRight size={13} />
                </button>

                <div className="mt-5 flex items-center gap-2 text-[#093C5D] font-semibold text-xs">
                  <Sparkles size={14} />
                  Interactive & Activity Learning
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}