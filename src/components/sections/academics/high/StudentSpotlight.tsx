'use client';

import React, { useEffect, useState } from "react";
import { Trophy, Loader2 } from "lucide-react";
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

export default function StudentSpotlight() {
  const [results, setResults] = useState<TopResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get<TopResult[]>(`${SERVER_URL}/api/top-results`);
        setResults(res.data || []);
      } catch (err) {
        console.error("Failed to fetch top results from API", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* HEADING ROW */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="uppercase tracking-[3px] text-[#FA6781] text-xs font-bold">
              Academic Honours
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#093C5D] mt-2 leading-tight">
              Our Outstanding Results
            </h2>
            <div className="h-1 w-20 bg-[#FA6781] rounded-full mx-auto mt-4" />
            <p className="max-w-2xl mx-auto mt-4 text-[#06283D]/70 text-sm sm:text-base">
              Celebrating the dedication of our students, guidance of our faculty, and trust of our parents that make these achievements possible.
            </p>
          </motion.div>
        </div>

        {/* CARDS GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
            <Loader2 size={28} className="animate-spin text-[#093C5D]" />
            <p className="text-xs font-semibold">Loading top performers...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((result, idx) => (
              <motion.div
                key={result.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (idx % 4) * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
                className="bg-white border border-[#093C5D]/10 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition duration-300 flex flex-col cursor-pointer group"
              >
                {/* IMAGE PORTION */}
                <div className="relative aspect-square overflow-hidden bg-slate-100 shrink-0">
                  {result.imageUrl ? (
                    <img
                      src={result.imageUrl}
                      alt={result.studentName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#093C5D]/5 to-slate-200 flex flex-col items-center justify-center p-6 text-center">
                      <Trophy className="text-[#FFC94D]/70 mb-2" size={32} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#093C5D]/40">NPS Topper</span>
                    </div>
                  )}
                  
                  {/* RANK BADGE */}
                  <div className="absolute top-3 left-3 bg-[#FFC94D] border border-[#093C5D]/15 px-2.5 py-0.5 rounded-full flex items-center shadow-sm">
                    <span className="text-[10px] font-black text-[#093C5D]">#{idx + 1}</span>
                  </div>

                  {/* MARKS SCORE BADGE */}
                  <div className="absolute top-3 right-3 bg-[#FA6781] text-white px-2.5 py-0.5 rounded-full shadow-sm">
                    <span className="text-[10px] sm:text-[11px] font-black">{result.marks}</span>
                  </div>
                </div>

                {/* CARD DETAILS */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-[#093C5D] leading-tight truncate group-hover:text-[#FA6781] transition">
                      {result.studentName}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-bold mt-1">{result.className}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-0.5">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Parents</span>
                    <span className="text-[11px] font-semibold text-[#06283D]/80 truncate">{result.parentsName}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-[#093C5D]/10 rounded-3xl p-8 shadow-xs max-w-lg mx-auto">
            <Trophy className="mx-auto text-[#FFC94D]/80 mb-3 animate-bounce" size={40} />
            <h3 className="font-extrabold text-[#093C5D] text-sm">Honours Board</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">No outstanding board examination results have been added to the Honours Board yet.</p>
          </div>
        )}

      </div>
    </section>
  );
}