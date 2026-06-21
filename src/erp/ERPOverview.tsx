import React, { useState, useEffect } from "react";
import { ModuleType } from "./types";
import { LucideIcon, RefreshCw, PlusCircle, X, Check, Loader2 } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface ERPOverviewProps {
  user: any;
  modules: ModuleType[];
  summaryStats: {
    label: string;
    value: string;
    color: string;
    icon: LucideIcon;
  }[];
  setActiveModule: (id: string) => void;
  selectedSession: string;
  setSelectedSession: (session: string) => void;
  sessions: any[];
  fetchSessions: (autoSelectLatest?: boolean) => Promise<void>;
}

export default function ERPOverview({
  user,
  modules,
  summaryStats: initialStats,
  setActiveModule,
  selectedSession,
  setSelectedSession,
  sessions,
  fetchSessions
}: ERPOverviewProps) {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);
  
  // Create Session state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSessionYear, setNewSessionYear] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

  const fetchDashboardStats = async () => {
    if (!selectedSession) return;
    setLoading(true);
    try {
      // Fetch students count filtered by session
      const studentsRes = await axios.get(`${SERVER_URL}/api/erp/students`, {
        params: { limit: 1, session: selectedSession },
        withCredentials: true
      });
      const studentsCount = studentsRes.data.pagination?.totalCount ?? 0;

      // Fetch teachers count
      const teachersRes = await axios.get(`${SERVER_URL}/api/teachers`, {
        withCredentials: true
      });
      const teachersCount = teachersRes.data?.length ?? 0;

      // Fetch pending fees count filtered by session
      const feesRes = await axios.get(`${SERVER_URL}/api/erp/fees/stats`, {
        params: { session: selectedSession },
        withCredentials: true
      });
      const pendingCount = (feesRes.data?.prevPendingCount ?? 0) + (feesRes.data?.currentPendingCount ?? 0);

      setStats([
        { label: "Total Students", value: studentsCount.toString(), color: "#093C5D", icon: initialStats[0].icon },
        { label: "Teaching Staff", value: teachersCount.toString(), color: "#59B292", icon: initialStats[1].icon },
        { label: "Pending Fees (Students)", value: pendingCount.toString(), color: "#FA6781", icon: initialStats[2].icon }
      ]);
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [selectedSession]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionYear) return;
    setCreateLoading(true);
    setCreateError(null);
    try {
      const res = await axios.post(`${SERVER_URL}/api/erp/sessions`, {
        year: newSessionYear
      }, { withCredentials: true });

      if (res.data.success) {
        setNewSessionYear("");
        setShowCreateModal(false);
        // Refresh session list and auto select the newly created session
        await fetchSessions(true);
      }
    } catch (err: any) {
      setCreateError(err.response?.data?.message || "Failed to create session.");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#093C5D] to-[#0d5685] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#093C5D]/10 relative overflow-hidden">
        {/* Abstract background details */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#59B292]/10 rounded-full blur-xl -ml-20 -mb-20" />
        
        <div className="space-y-1.5 relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#59B292]">Dashboard Overview</span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none animate-fade-in">
            Welcome, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-xs text-slate-200 font-medium">
            Neelgiri Public Sen. Sec. School Management System
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 relative z-10 self-start sm:self-center">
          {/* Session Selector */}
          <div className="flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1.5 rounded-2xl">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-200">Active Session:</span>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="bg-transparent text-xs font-black text-white focus:outline-none cursor-pointer border-0 [color-scheme:dark]"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.year} className="text-slate-800 bg-white font-bold">{s.year}</option>
              ))}
            </select>
          </div>

          {/* Create Session Option (Subtle secondary layout) */}
          {user?.role === "Owner" && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="h-9 px-3 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 border border-white/10 flex items-center justify-center gap-1.5 text-white text-xs font-bold transition cursor-pointer"
              title="Create New Academic Session"
            >
              <PlusCircle size={13} />
              <span className="hidden sm:inline">New Session</span>
            </button>
          )}

          <button
            onClick={fetchDashboardStats}
            disabled={loading}
            className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 border border-white/10 flex items-center justify-center text-white transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {stats.map(({ label, value, color, icon: Icon }, idx) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-3xl border border-slate-200/50 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition duration-200"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: `${color}12` }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-2xl font-black text-[#093C5D] tracking-tight leading-none">
                {loading ? (
                  <span className="inline-block w-8 h-6 bg-slate-100 animate-pulse rounded-md" />
                ) : (
                  value
                )}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 leading-none">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Module Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Modules</p>
          <span className="text-[10px] font-bold text-slate-400">Select any module to open</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            const isComingSoon = mod.status === "coming-soon";
            return (
              <motion.button
                key={mod.id}
                disabled={isComingSoon}
                onClick={() => setActiveModule(mod.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.03 }}
                className={`group text-left border rounded-3xl p-6 shadow-sm transition-all duration-200 flex flex-col justify-between h-44 ${
                  isComingSoon
                    ? "bg-slate-50/50 border-slate-100 opacity-60 cursor-not-allowed"
                    : "bg-white border-slate-200/50 hover:border-[#093C5D]/20 hover:shadow-md cursor-pointer active:scale-[0.99]"
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                    style={{ background: mod.bg }}
                  >
                    <Icon size={22} style={{ color: mod.color }} />
                  </div>
                  {isComingSoon ? (
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/40">
                      Under Dev
                    </span>
                  ) : (
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/40">
                      Active
                    </span>
                  )}
                </div>
                
                <div className="space-y-1 mt-4">
                  <h3 className="text-sm font-black text-[#093C5D] group-hover:text-[#FA6781] transition-colors leading-tight">
                    {mod.label}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {mod.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Create Session Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-xl space-y-4 relative"
            >
              <button
                onClick={() => { setShowCreateModal(false); setCreateError(null); }}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-650 border-0 bg-transparent cursor-pointer p-1"
              >
                <X size={15} />
              </button>

              <div>
                <h3 className="text-sm font-black text-[#093C5D]">Create Academic Session</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">This operation is typically performed once a year.</p>
              </div>

              {createError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertTriangle size={13} className="shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <form onSubmit={handleCreateSession} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Session Year</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2027-2028"
                    value={newSessionYear}
                    onChange={(e) => setNewSessionYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D]"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowCreateModal(false); setCreateError(null); }}
                    className="flex-1 py-2 border border-slate-200 text-slate-500 font-bold text-xs rounded-xl transition hover:bg-slate-50 cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="flex-1 py-2 bg-[#59B292] hover:bg-[#439678] text-white font-bold text-xs rounded-xl transition border-0 cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    {createLoading && <Loader2 size={12} className="animate-spin" />}
                    Confirm
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Inline fallback icon in case AlertTriangle is not imported
function AlertTriangle(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      style={{ width: props.size, height: props.size }}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
