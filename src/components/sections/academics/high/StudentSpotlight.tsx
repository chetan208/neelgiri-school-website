import React from "react";
import { Trophy, ArrowRight, Star } from "lucide-react";

interface StudentType {
  rank: string;
  name: string;
  grade: string;
  score: string;
  achievement: string;
  image: string;
}

export default function StudentSpotlight() {
  const students: StudentType[] = [
    {
      rank: "01",
      name: "Aarav Sharma",
      grade: "Class 10",
      score: "98.6%",
      achievement: "Science Olympiad Topper",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      rank: "02",
      name: "Ananya Verma",
      grade: "Class 9",
      score: "96.8%",
      achievement: "National Debate Winner",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",
    },
    {
      rank: "03",
      name: "Vihaan Kapoor",
      grade: "Class 8",
      score: "95.9%",
      achievement: "Coding Excellence",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      rank: "04",
      name: "Priya Negi",
      grade: "Class 7",
      score: "94.5%",
      achievement: "Art & Craft State Winner",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1200&auto=format&fit=crop",
    },
    {
      rank: "05",
      name: "Rohan Thakur",
      grade: "Class 6",
      score: "93.2%",
      achievement: "Mathematics Champion",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-10 sm:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* HEADING ROW */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7 sm:mb-10">
          <div>
            <p className="uppercase tracking-[2.5px] text-teal-700 text-[10px] sm:text-xs font-bold">
              Student Spotlight
            </p>
            <h2 className="text-[1.6rem] sm:text-3xl md:text-4xl font-bold text-slate-800 mt-1.5 leading-tight">
              Top Performers
            </h2>
          </div>
          <button className="hidden sm:flex items-center gap-1.5 text-teal-700 font-semibold hover:text-teal-800 transition text-sm w-fit cursor-pointer">
            View All Results <ArrowRight size={15} />
          </button>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {students.map((student) => (
            <div key={student.name} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="relative">
                <img
                  src={student.image}
                  alt={student.name}
                  className="w-full h-36 sm:h-52 lg:h-56 object-cover object-top"
                />
                {/* RANK BADGE */}
                <div className="absolute top-2 left-2 bg-white/95 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Trophy size={11} className="text-amber-500" />
                  <span className="text-[10px] font-bold text-slate-700">#{student.rank}</span>
                </div>
                {/* SCORE BADGE */}
                <div className="absolute top-2 right-2 bg-teal-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                  <span className="text-[10px] sm:text-[11px] font-bold">{student.score}</span>
                </div>
              </div>

              {/* CARD DETAILS */}
              <div className="p-3 sm:p-4">
                <h3 className="text-[13px] sm:text-base font-bold text-slate-800 leading-tight truncate">{student.name}</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-medium">{student.grade}</p>
                <div className="mt-2 flex items-start gap-1">
                  <Star size={10} className="text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-tight line-clamp-2">{student.achievement}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BUTTON AT BOTTOM */}
        <div className="flex justify-center mt-7 sm:mt-10">
          <button className="flex items-center gap-2 border border-slate-200 hover:border-teal-500 hover:text-teal-700 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-semibold transition duration-300 cursor-pointer bg-white">
            View All Results <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </section>
  );
}