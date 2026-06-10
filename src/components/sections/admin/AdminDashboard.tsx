'use client';

import React, { useState } from "react";
import { BarChart3, FileText, BookOpen, Image, Menu, X, GraduationCap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import StatsManager from "./StatsManager";
import NoticeManager from "./NoticeManager";
import PaperManager from "./PaperManager";
import MediaManager from "./gallery/MediaManager";
import AdmissionsControlPanel from "./Admissions/AdmissionsControlPanel"; // Placeholder import path mapping

type TabIdType = "stats" | "notices" | "papers" | "media" | "admissions";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabIdType>("stats");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  const TabComponents: Record<TabIdType, React.ReactNode> = {
    stats: <StatsManager />,
    notices: <NoticeManager />,
    papers: <PaperManager />,
    media: <MediaManager />,
    admissions: <AdmissionsControlPanel />
  };

  const menuItems = [
    { id: "stats", label: "School Stats", icon: <BarChart3 size={15} />, isVisible: user.role === "Owner" || user.role === "Admin" },
    { id: "notices", label: "Notices Archive", icon: <FileText size={15} />, isVisible: user.role === "Owner" || user.role === "Admin" },
    { id: "papers", label: "Question Papers", icon: <BookOpen size={15} />, isVisible: user.role === "Owner" || user.role === "Admin" },
    { id: "media", label: "Media Gallery", icon: <Image size={15} />, isVisible: user.role === "Owner" || user.role === "Admin" },
    { id: "admissions", label: "Admissions", icon: <GraduationCap size={15} />, isVisible: user.role === "Owner" },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 flex flex-col lg:flex-row font-sans relative">
      
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        className="lg:hidden fixed bottom-6 right-6 z-50 p-3 bg-slate-950 text-white rounded-full shadow-lg border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition-all active:scale-95 cursor-pointer"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sticky Left Navigation Sidebar Container */}
      <aside className={`
        bg-white border-r border-slate-200 transition-all duration-200 z-40
        lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:w-60 lg:block lg:transform-none lg:opacity-100
        fixed inset-y-0 left-0 w-64
        ${isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-5 hidden lg:block border-b border-slate-100">
          <h1 className="text-sm font-black font-serif tracking-tight text-slate-950">Neelgiri School</h1>
          <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mt-0.5">Control Panel</p>
        </div>

        <div className="p-5 lg:hidden border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Admin Menu</span>
        </div>
        
        <nav className="p-3.5 space-y-1">
          {menuItems.map((item) => {
            if (!item.isVisible) return null;
            const isTabActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as TabIdType); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  isTabActive 
                    ? "bg-slate-950 border-slate-950 text-white shadow-xs" 
                    : "text-slate-500 border-transparent bg-transparent hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile background responsive drawer shade overlay */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-slate-950/20 backdrop-blur-xs z-30 lg:hidden" />
      )}

      {/* Operational Active Target Form Viewport Grid */}
      <main className="flex-1 min-w-0 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {TabComponents[activeTab]}
        </div>
      </main>

    </div>
  );
}