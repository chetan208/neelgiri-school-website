'use client';

import React, { useState } from "react";
import { BarChart3, FileText, BookOpen, Image, Menu, X, GraduationCap, Users, Mail, Calendar, Trophy } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import StatsManager from "./StatsManager";
import NoticeManager from "./NoticeManager";
import PaperManager from "./PaperManager";
import MediaManager from "./gallery/MediaManager";
import AdmissionsControlPanel from "./Admissions/AdmissionsControlPanel"; // Placeholder import path mapping
import StaffManager from "./StaffManager";
import ContactManager from "./ContactManager";
import CalendarManager from "./CalendarManager";
import ResultsManager from "./ResultsManager";

type TabIdType = "stats" | "notices" | "papers" | "media" | "admissions" | "staff" | "contact" | "calendar" | "results";

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
    admissions: <AdmissionsControlPanel />,
    staff: <StaffManager />,
    contact: <ContactManager />,
    calendar: <CalendarManager />,
    results: <ResultsManager />
  };

  const menuItems = [
    { id: "stats", label: "School Stats", icon: <BarChart3 size={15} />, isVisible: user.role === "Owner" || user.role === "Admin" },
    { id: "staff", label: "Manage Staff", icon: <Users size={15} />, isVisible: user.role === "Owner" },
    { id: "contact", label: "Contact Inquiries", icon: <Mail size={15} />, isVisible: user.role === "Owner" || user.role === "Admin" },
    { id: "calendar", label: "Manage Calendar", icon: <Calendar size={15} />, isVisible: user.role === "Owner" || user.role === "Admin" },
    { id: "results", label: "Top Results", icon: <Trophy size={15} />, isVisible: user.role === "Owner" || user.role === "Admin" },
    { id: "notices", label: "Notices Archive", icon: <FileText size={15} />, isVisible: user.role === "Owner" || user.role === "Admin" },
    { id: "papers", label: "Question Papers", icon: <BookOpen size={15} />, isVisible: user.role === "Owner" || user.role === "Admin" },
    { id: "media", label: "Media Gallery", icon: <Image size={15} />, isVisible: user.role === "Owner" || user.role === "Admin" },
    { id: "admissions", label: "Admissions", icon: <GraduationCap size={15} />, isVisible: user.role === "Owner" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#093C5D] flex flex-col lg:flex-row font-sans relative">
      
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        className="lg:hidden fixed bottom-6 right-6 z-50 p-3 bg-[#093C5D] text-white rounded-full shadow-lg border border-[#093C5D]/80 flex items-center justify-center hover:bg-[#001F42] transition-all active:scale-95 cursor-pointer"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sticky Left Navigation Sidebar Container */}
      <aside className={`
        bg-white border-r border-[#093C5D]/20 transition-all duration-200 z-40
        lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:w-60 lg:block lg:transform-none lg:opacity-100
        fixed inset-y-0 left-0 w-64
        ${isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-5 hidden lg:block border-b border-[#093C5D]/20">
          <h1 className="text-sm font-black font-serif tracking-tight text-[#093C5D]">Neelgiri School</h1>
          <p className="text-[9px] font-black uppercase tracking-widest text-[#59B292] mt-0.5">Control Panel</p>
        </div>

        <div className="p-5 lg:hidden border-b border-[#093C5D]/20 flex justify-between items-center bg-[#F8FAFC]">
          <span className="text-xs font-black uppercase tracking-widest text-[#06283D]/60">Admin Menu</span>
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
                    ? "bg-[#093C5D] border-[#093C5D] text-white shadow-xs" 
                    : "text-[#06283D]/70 border-transparent bg-transparent hover:bg-[#093C5D]/10 hover:text-[#093C5D]"
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
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-[#093C5D]/20 backdrop-blur-xs z-30 lg:hidden" />
      )}

      {/* Operational Active Target Form Viewport Grid */}
      <main className="flex-1 min-w-0 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === "staff" && user.role !== "Owner" ? (
            <div className="text-center py-20 text-slate-500 font-semibold font-serif text-lg">
              Access Denied. Owner permissions required to manage staff.
            </div>
          ) : activeTab === "contact" && user.role !== "Owner" && user.role !== "Admin" ? (
            <div className="text-center py-20 text-slate-500 font-semibold font-serif text-lg">
              Access Denied. Admin permissions required to view contact messages.
            </div>
          ) : activeTab === "calendar" && user.role !== "Owner" && user.role !== "Admin" ? (
            <div className="text-center py-20 text-slate-500 font-semibold font-serif text-lg">
              Access Denied. Admin permissions required to manage calendar.
            </div>
          ) : (
            TabComponents[activeTab]
          )}
        </div>
      </main>

    </div>
  );
}