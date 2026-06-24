import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ERPSidebar from "./ERPSidebar";
import ERPOverview from "./ERPOverview";
import ERPModuleWrapper from "./ERPModuleWrapper";
import { modules, summaryStats } from "./types";
import { Menu, X, AlertTriangle } from "lucide-react";
import axios from "axios";

export default function ERPDashboardContent() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [preselectedStudent, setPreselectedStudent] = useState<any>(null);

  // Lift session state to global dashboard level
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState("");

  const [whatsappConnected, setWhatsappConnected] = useState(true);
  const [showWhatsappWarning, setShowWhatsappWarning] = useState(false);

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

  const fetchWhatsappStatus = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/erp/whatsapp/status`, { withCredentials: true });
      if (res.data.success) {
        const isConnected = res.data.status?.connected || false;
        setWhatsappConnected(isConnected);
        localStorage.setItem("whatsapp_connected", isConnected ? "true" : "false");
        
        // Update popup warning state based on actual status
        if (!isConnected) {
          setShowWhatsappWarning(true);
        } else {
          setShowWhatsappWarning(false);
        }
      }
    } catch (err) {
      console.error("Error checking WhatsApp status:", err);
      // On error, assume disconnected to be safe and show warning popup
      setWhatsappConnected(false);
      localStorage.setItem("whatsapp_connected", "false");
      setShowWhatsappWarning(true);
    }
  };

  useEffect(() => {
    // Check cached connection status to show warning instantly on mount/refresh
    const cachedConnected = localStorage.getItem("whatsapp_connected");
    if (cachedConnected === "false" || cachedConnected === null) {
      setShowWhatsappWarning(true);
    }
    
    fetchWhatsappStatus();
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
        whatsappConnected={whatsappConnected}
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
              whatsappConnected={whatsappConnected}
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

      {/* WhatsApp Disconnected Warning Modal */}
      {showWhatsappWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative my-8 animate-in zoom-in-95 duration-200 text-slate-800">
            <button
              onClick={() => {
                setShowWhatsappWarning(false);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-650 border-0 bg-transparent cursor-pointer p-1"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#093C5D]">WhatsApp Gateway Disconnected</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Critical Connection Warning</p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-600 leading-relaxed">
              <p>Your official school WhatsApp alerts account is currently <strong className="text-rose-600">not connected</strong>.</p>
              <p className="bg-amber-50 border border-amber-100 text-amber-800 p-3 rounded-xl">
                Automatic fee demand billing invoices, registration notifications, and payment reminders will <strong>not</strong> be delivered to parents until you connect your WhatsApp.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowWhatsappWarning(false);
                }}
                className="flex-1 py-2.5 border border-slate-200 text-slate-500 font-bold text-xs rounded-xl transition hover:bg-slate-50 cursor-pointer bg-transparent"
              >
                Ignore Warning
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowWhatsappWarning(false);
                  setActiveModule("settings");
                }}
                className="flex-1 py-2.5 bg-[#093C5D] hover:bg-[#001F42] text-white font-bold text-xs rounded-xl transition border-0 cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-[#093C5D]/10"
              >
                Connect WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
