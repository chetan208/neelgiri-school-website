'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Settings, Save, Loader2, Info, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

interface FeeDefaults {
  admissionFee: number;
  tuitionFee: number;
  examFee: number;
  ptmFine: number;
  computerFee: number;
  tieBeltBooks: number;
  buildingFund: number;
  annualCharges: number;
}

const FIELDS: { key: keyof FeeDefaults; label: string }[] = [
  { key: "tuitionFee",    label: "Tuition Fee" },
  { key: "examFee",       label: "Exam Fee" },
  { key: "computerFee",   label: "Computer Fee" },
  { key: "ptmFine",       label: "PTM Fine" },
  { key: "buildingFund",  label: "Building Fund" },
  { key: "annualCharges", label: "Annual Charges" },
  { key: "tieBeltBooks",  label: "Tie, Belt and Books" },
  { key: "admissionFee",  label: "Admission Fee" },
];

const CLASSES = [
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "Class 11", "Class 12", "LKG", "UKG", "Nursery"
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const inputCls = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D] transition-all";

export default function FeeDefaultsSettings() {
  const { user } = useAuth();
  const isOwner = user?.role === "Owner";

  const [selectedClass, setSelectedClass] = useState("Class 1");
  const [configMode, setConfigMode] = useState<"default" | "special">("default");
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);

  const [form, setForm] = useState<FeeDefaults>({
    admissionFee: 0, tuitionFee: 0, examFee: 0, ptmFine: 0,
    computerFee: 0, tieBeltBooks: 0, buildingFund: 0, annualCharges: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchDefaults = async (cls: string, mode: "default" | "special", month: string) => {
    setLoading(true);
    try {
      // 1. Fetch default fees as baseline
      const defaultRes = await axios.get(`${SERVER_URL}/api/erp/classes/fees`, {
        params: { className: cls },
        withCredentials: true
      });
      const defaultData = defaultRes.data?.data || {};
      let finalData = { ...defaultData };

      // 2. If special mode, fetch specific month and override if exists
      if (mode === "special") {
        const specialRes = await axios.get(`${SERVER_URL}/api/erp/classes/monthly-fees`, {
          params: { className: cls, monthName: month },
          withCredentials: true
        });
        const specialFees = specialRes.data?.fees || [];
        if (specialFees.length > 0) {
          finalData = { ...finalData, ...specialFees[0] };
        }
      }
      
      setForm({
        admissionFee: Number(finalData.admissionFee) || 0,
        tuitionFee: Number(finalData.tuitionFee) || 0,
        examFee: Number(finalData.examFee) || 0,
        ptmFine: Number(finalData.ptmFine) || 0,
        computerFee: Number(finalData.computerFee) || 0,
        tieBeltBooks: Number(finalData.tieBeltBooks) || 0,
        buildingFund: Number(finalData.buildingFund) || 0,
        annualCharges: Number(finalData.annualCharges) || 0,
      });
    } catch {
      setForm({
        admissionFee: 0, tuitionFee: 0, examFee: 0, ptmFine: 0,
        computerFee: 0, tieBeltBooks: 0, buildingFund: 0, annualCharges: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefaults(selectedClass, configMode, selectedMonth);
  }, [selectedClass, configMode, selectedMonth]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;
    setSaving(true);
    setMessage(null);
    try {
      if (configMode === "default") {
        const payload = { className: selectedClass, ...form };
        await axios.post(`${SERVER_URL}/api/erp/classes/fees`, payload, { withCredentials: true });
        setMessage({ type: "success", text: `Fee defaults saved successfully for ${selectedClass}.` });
      } else {
        const payload = { className: selectedClass, monthName: selectedMonth, ...form };
        await axios.post(`${SERVER_URL}/api/erp/classes/monthly-fees`, payload, { withCredentials: true });
        setMessage({ type: "success", text: `Special fees saved successfully for ${selectedClass} in ${selectedMonth}.` });
      }
      setTimeout(() => setMessage(null), 4000);
    } catch {
      setMessage({ type: "error", text: "Failed to save. Only Owner accounts can modify fee defaults." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#093C5D]/8 flex items-center justify-center">
            <Settings size={18} className="text-[#093C5D]" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#093C5D] uppercase tracking-wider">Fee Defaults Configuration</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Set default starting values for rollout. Class-specific configurations inherit from Global Defaults.
            </p>
          </div>
        </div>
        {!isOwner && (
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg shrink-0">
            <AlertCircle size={12} /> Owner Only
          </span>
        )}
      </div>

      <div className="px-6 py-5">
        {/* Mode Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full max-w-sm mb-6">
          <button
            onClick={() => setConfigMode("default")}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              configMode === "default" ? "bg-white text-[#093C5D] shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Default Fees
          </button>
          <button
            onClick={() => setConfigMode("special")}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              configMode === "special" ? "bg-white text-[#093C5D] shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Specific Month
          </button>
        </div>

        {/* Selection Dropdowns */}
        <div className="flex flex-wrap items-center gap-4 mb-5 max-w-2xl">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 flex-1 min-w-[200px]">
            <label className="text-xs font-black uppercase tracking-wider text-[#093C5D] shrink-0">Class:</label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D] transition-all cursor-pointer text-slate-700"
            >
              {CLASSES.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {configMode === "special" && (
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 flex-1 min-w-[200px]">
              <label className="text-xs font-black uppercase tracking-wider text-[#093C5D] shrink-0">Month:</label>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D] transition-all cursor-pointer text-slate-700"
              >
                {MONTHS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Info note */}
        <div className="flex items-start gap-2.5 bg-[#093C5D]/4 border border-[#093C5D]/10 rounded-xl px-4 py-3 mb-5">
          <Info size={14} className="text-[#093C5D] shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {configMode === "default"
              ? `These are the default fees applied for ${selectedClass} every month unless a special fee is defined for a specific month.`
              : `These fees will override the default class fees specifically for ${selectedMonth}. Any month without a special configuration will fallback to the default class fees.`}
          </p>
        </div>

        {loading ? (
          <div className="space-y-5 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <div className="h-3 w-20 bg-slate-200 rounded mb-2"></div>
                  <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
                </div>
              ))}
            </div>
            <div className="h-12 w-full bg-slate-50 rounded-xl"></div>
            <div className="h-10 w-32 bg-[#093C5D]/20 rounded-xl"></div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FIELDS.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    {label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    disabled={!isOwner}
                    value={form[key] || ""}
                    onChange={e => setForm(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                    className={`${inputCls} ${!isOwner ? "cursor-not-allowed opacity-60" : ""}`}
                  />
                </div>
              ))}
            </div>

            {/* Bus charges note */}
            <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 font-medium">
                Bus charges are not set here. Go to the Transport module to configure per-station rates. Transit charges are dynamically calculated per student based on their station.
              </p>
            </div>

            {message && (
              <div className={`px-4 py-3 rounded-xl text-xs font-bold border ${
                message.type === "success"
                  ? "bg-[#093C5D]/5 border-[#093C5D]/20 text-[#093C5D]"
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }`}>
                {message.text}
              </div>
            )}

            {isOwner && (
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#093C5D] hover:bg-[#0b4870] text-white rounded-xl text-xs font-black uppercase tracking-wider border-0 cursor-pointer transition shadow-sm active:scale-95"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {saving ? "Saving..." : "Save Defaults"}
              </button>
            )}
          </form>
        )}
      </div>
    </motion.div>
  );
}
