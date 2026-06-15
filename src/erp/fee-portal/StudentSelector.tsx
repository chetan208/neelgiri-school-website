import React from "react";
import { Search, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StudentType } from "./types";

interface StudentSelectorProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  students: StudentType[];
  searchLoading: boolean;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  onSelectStudent: (st: StudentType) => void;
  onClearSelection: () => void;
  searchContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function StudentSelector({
  searchQuery,
  setSearchQuery,
  students,
  searchLoading,
  showDropdown,
  setShowDropdown,
  onSelectStudent,
  onClearSelection,
  searchContainerRef
}: StudentSelectorProps) {
  return (
    <div ref={searchContainerRef} className="relative w-full max-w-2xl mx-auto z-20">
      <label className="block text-xs font-black uppercase tracking-wider text-[#093C5D] mb-2 text-center sm:text-left">
        Search Student by Roll Number
      </label>
      <div className="relative flex items-center">
        <Search size={18} className="absolute left-4 text-slate-400" />
        <input
          type="text"
          inputMode="numeric"
          placeholder="Enter roll number (e.g. 703)..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!e.target.value) {
              onClearSelection();
            }
          }}
          onFocus={() => {
            if (searchQuery) setShowDropdown(true);
          }}
          className="w-full pl-12 pr-10 py-3 bg-white border-2 border-slate-200/80 text-sm font-mono font-semibold tracking-widest rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-[#093C5D]/10 focus:border-[#093C5D] transition-all"
        />
        {searchQuery && (
          <button
            onClick={onClearSelection}
            className="absolute right-4 text-slate-400 hover:text-slate-600 border-0 bg-transparent cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <p className="text-[10px] text-slate-400 font-medium mt-1.5 ml-1">
        Search is strictly by roll number — names are not matched
      </p>

      {/* Floating Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-[300px] overflow-y-auto z-30 divide-y divide-slate-100"
          >
            {searchLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-[#093C5D]" size={20} />
              </div>
            ) : students.length > 0 ? (
              students.map((st) => (
                <button
                  key={st.id}
                  onClick={() => onSelectStudent(st)}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition text-left cursor-pointer border-0 text-xs font-bold text-slate-700"
                >
                  <div>
                    <p className="text-sm font-black text-[#093C5D]">{st.name}</p>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5">{st.studentClass}</p>
                  </div>
                  <span className="font-mono text-xs text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
                    Roll: {st.cardNo}
                  </span>
                </button>
              ))
            ) : (
              <div className="p-5 text-center text-slate-400 italic text-xs">
                No student found with roll number "{searchQuery}".
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
