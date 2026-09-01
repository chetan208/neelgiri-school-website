import React from "react";
import { motion } from "framer-motion";
import { StudentType } from "./types";

interface StudentProfileBannerProps {
  selectedStudent: StudentType;
  onClearSelection: () => void;
}

export default function StudentProfileBanner({
  selectedStudent,
  onClearSelection
}: StudentProfileBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#093C5D] via-[#0b4870] to-[#0a578a] text-white p-6 rounded-3xl shadow-md border border-[#093c5d]/20 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-400/20">
            Active Account
          </span>
          <span className="font-mono text-xs font-bold text-[#14B8A6] bg-white/10 px-2 py-0.5 rounded border border-white/5">
            Roll No: {selectedStudent.cardNo}
          </span>
        </div>
        <h3 className="text-xl font-black tracking-tight">{selectedStudent.name}</h3>
        <p className="text-xs text-white/80 font-semibold flex items-center gap-4 flex-wrap">
          <span><strong>Class:</strong> {(selectedStudent as any).studentclass?.className || "N/A"}</span>
          <span>&middot;</span>
          <span><strong>Father:</strong> {selectedStudent.fatherName || "N/A"}</span>
          <span>&middot;</span>
          <span><strong>Mother:</strong> {selectedStudent.motherName || "N/A"}</span>
          <span>&middot;</span>
          <span><strong>Contact:</strong> {selectedStudent.contactNo || "N/A"}</span>
          <span>&middot;</span>
          <span>
            <strong>Station:</strong>{" "}
            {selectedStudent.station
              ? selectedStudent.station
              : <em className="text-white/50 not-italic">Day Scholar</em>
            }
          </span>
        </p>
      </div>
      <button
        onClick={onClearSelection}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-bold text-white transition active:scale-95 cursor-pointer shrink-0"
      >
        Clear Selection
      </button>
    </motion.div>
  );
}
