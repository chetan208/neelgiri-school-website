'use client';

import React, { useEffect, useState } from "react";
import { Trophy, Loader2, Star } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

interface TopResult {
  id: string;
  studentName: string;
  className: string;
  marks: string;
  parentsName: string;
  imageUrl?: string;
  imagePublicId?: string;
  createdAt: string;
}

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8000";

// Rank medal colors
const medalColors: Record<number, { bg: string; text: string; label: string }> = {
  0: { bg: "#FFC94D", text: "#6B4800", label: "Gold" },
  1: { bg: "#C0C0C0", text: "#3A3A3A", label: "Silver" },
  2: { bg: "#CD7F32", text: "#fff",    label: "Bronze" },
};

function ResultCard({ result, idx }: { result: TopResult; idx: number }) {
  const medal = medalColors[idx];
  const rankColor = medal?.bg ?? "#093C5D";
  const rankText  = medal?.text ?? "#fff";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: (idx % 4) * 0.08 }}
      viewport={{ once: true }}
      className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-row sm:flex-col"
    >
      {/* Photo — left strip on mobile, top block on sm+ */}
      <div className="relative shrink-0 w-[90px] sm:w-full aspect-square sm:aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#093C5D]/5 to-slate-200">
        {result.imageUrl ? (
          <img
            src={result.imageUrl}
            alt={result.studentName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            <Trophy size={28} className="text-[#FFC94D]/60" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#093C5D]/30">Topper</span>
          </div>
        )}

        {/* Rank badge */}
        <div
          className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center shadow-sm text-[10px] font-black"
          style={{ background: rankColor, color: rankText }}
        >
          #{idx + 1}
        </div>

        {/* Score badge */}
        <div className="absolute bottom-2 right-2 bg-[#FA6781] text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
          {result.marks}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="text-[13px] sm:text-sm font-black text-[#093C5D] leading-tight truncate">
            {result.studentName}
          </h3>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
            <Star size={9} className="text-[#FFC94D] fill-[#FFC94D] shrink-0" />
            {result.className}
          </p>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-300 block">Parent</span>
          <span className="text-[11px] font-semibold text-[#06283D]/70 truncate block mt-0.5">{result.parentsName}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function StudentSpotlight() {
  const [results, setResults] = useState<TopResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<TopResult[]>(`${SERVER_URL}/api/top-results`)
      .then((res) => setResults(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-14 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Heading */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="uppercase tracking-[3px] text-[#FA6781] text-[10px] sm:text-xs font-bold">
              Academic Honours
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#093C5D] mt-2 leading-tight">
              Our Outstanding Results
            </h2>
            <div className="h-1 w-16 bg-[#FA6781] rounded-full mx-auto mt-3" />
            <p className="max-w-xl mx-auto mt-3 text-[#06283D]/60 text-xs sm:text-sm leading-relaxed">
              Celebrating the dedication of our students, guidance of our faculty, and the trust of our parents.
            </p>
          </motion.div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 size={26} className="animate-spin text-[#093C5D]" />
            <p className="text-xs font-semibold">Loading top performers...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {results.map((result, idx) => (
              <ResultCard key={result.id || idx} result={result} idx={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-14 bg-white border border-[#093C5D]/10 rounded-3xl shadow-xs max-w-md mx-auto px-6">
            <Trophy className="mx-auto text-[#FFC94D]/70 mb-3 animate-bounce" size={36} />
            <h3 className="font-extrabold text-[#093C5D] text-sm">Honours Board</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              No outstanding results have been added yet. Check back soon.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}