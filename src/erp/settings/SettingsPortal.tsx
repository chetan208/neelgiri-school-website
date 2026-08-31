'use client';

import React from "react";
import { 
  Building2,
  Calendar,
  PhoneCall,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPortal() {
  return (
    <div className="space-y-8">
      {/* Settings Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <h2 className="text-xl font-black text-[#093C5D]">ERP Portal Settings</h2>
          <p className="text-xs text-slate-450 font-semibold mt-1">Configure integrations, notifications, and school parameters.</p>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="min-h-[350px]">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/50 p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-sm font-black text-[#093C5D] mb-1 flex items-center gap-2">
                <Building2 size={16} className="text-[#093C5D]" />
                School Information
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                Basic administrative data configured for the school. Edit parameters through the root database system.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 flex gap-3 items-center">
                <div className="w-10 h-10 rounded-xl bg-[#093C5D]/10 text-[#093C5D] flex items-center justify-center shrink-0">
                  <Building2 size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">School Name</p>
                  <p className="text-xs font-black text-[#093C5D] mt-0.5">Neelgiri Public Sen. Sec. School</p>
                </div>
              </div>

              <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 flex gap-3 items-center">
                <div className="w-10 h-10 rounded-xl bg-[#093C5D]/10 text-[#093C5D] flex items-center justify-center shrink-0">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Current Academic Year</p>
                  <p className="text-xs font-black text-[#093C5D] mt-0.5">2026-2027</p>
                </div>
              </div>

              <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 flex gap-3 items-center">
                <div className="w-10 h-10 rounded-xl bg-[#093C5D]/10 text-[#093C5D] flex items-center justify-center shrink-0">
                  <PhoneCall size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Contact Number</p>
                  <p className="text-xs font-black text-[#093C5D] mt-0.5">+91 98051 69647</p>
                </div>
              </div>

              <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 flex gap-3 items-center">
                <div className="w-10 h-10 rounded-xl bg-[#093C5D]/10 text-[#093C5D] flex items-center justify-center shrink-0">
                  <Info size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Board Affiliation</p>
                  <p className="text-xs font-black text-[#093C5D] mt-0.5">PSEB Board (Punjab)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
