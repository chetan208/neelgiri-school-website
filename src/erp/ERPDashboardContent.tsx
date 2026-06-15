import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ERPSidebar from "./ERPSidebar";
import ERPOverview from "./ERPOverview";
import ERPModuleWrapper from "./ERPModuleWrapper";
import { modules, summaryStats } from "./types";
import { Menu, X } from "lucide-react";
import axios from "axios";

export default function ERPDashboardContent() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [preselectedStudent, setPreselectedStudent] = useState<any>(null);

  // Lift session state to global dashboard level
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState("");

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

  const fetchSessions = async (autoSelectLatest = false) => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/erp/sessions`, { withCredentials: true });
      if (res.data.success) {
        setSessions(res.data.sessions);
        if (res.data.sessions.length > 0) {
          // If autoSelectLatest or if selectedSession is not set/exists in list
          if (autoSelectLatest || !selectedSession || !res.data.sessions.some((s: any) => s.year === selectedSession)) {
            setSelectedSession(res.data.sessions[0].year);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const filteredModules = modules.filter(m => {
    if (m.id === "transport" || m.id === "admissions") {
      return user?.role === "Owner";
    }
    return true;
  });

  const currentModule = filteredModules.find(m => m.id === activeModule);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <ERPSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        modules={filteredModules}
        user={user}
      />

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-20 lg:hidden transition-all duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-auto flex flex-col">

        {/* Mobile sidebar toggle */}
        <div className="lg:hidden sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-200/50 hover:bg-slate-100 transition active:scale-[0.95] cursor-pointer"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Neelgiri School</span>
            <span className="text-xs font-black text-[#093C5D] mt-0.5">Control Center</span>
          </div>
        </div>

        <div className="flex-1">
          {activeModule === null ? (
            <ERPOverview
              user={user}
              modules={filteredModules}
              summaryStats={summaryStats}
              setActiveModule={setActiveModule}
              selectedSession={selectedSession}
              setSelectedSession={setSelectedSession}
              sessions={sessions}
              fetchSessions={fetchSessions}
            />
          ) : (
            <ERPModuleWrapper
              activeModule={activeModule}
              currentModule={currentModule}
              setActiveModule={setActiveModule}
              preselectedStudent={preselectedStudent}
              setPreselectedStudent={setPreselectedStudent}
              selectedSession={selectedSession}
              sessions={sessions}
            />
          )}
        </div>
      </main>
    </div>
  );
}
