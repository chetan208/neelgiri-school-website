import React from "react";
import { ChevronRight, Wrench, ArrowLeft } from "lucide-react";
import StaffManager from "@/components/sections/admin/StaffManager";
import StudentManager from "@/components/sections/admin/StudentManager";
import FeePortal from "./fee-portal/FeePortal";
import TransportPortal from "./transport/TransportPortal";
import AdmissionsManager from "./admissions/AdmissionsManager";
import SettingsPortal from "./settings/SettingsPortal";
import { ModuleType } from "./types";

interface ERPModuleWrapperProps {
  activeModule: string;
  currentModule: ModuleType | undefined;
  setActiveModule: (id: string | null) => void;
  preselectedStudent: any;
  setPreselectedStudent: (student: any) => void;
  selectedSession: string;
  sessions: any[];
}

export default function ERPModuleWrapper({
  activeModule,
  currentModule,
  setActiveModule,
  preselectedStudent,
  setPreselectedStudent,
  selectedSession,
  sessions
}: ERPModuleWrapperProps) {
  return (
    <div className={`p-5 sm:p-7 mx-auto transition-all duration-300 ${activeModule === "fees" ? "max-w-none w-[98%]" : "max-w-6xl"}`}>
      {/* Breadcrumb Header */}
      <div className="mb-6 flex items-center gap-2 text-xs font-bold text-[#093C5D]">
        <button
          onClick={() => setActiveModule(null)}
          className="text-slate-400 hover:text-[#093C5D] transition cursor-pointer border-0 bg-transparent p-0"
        >
          ERP Overview
        </button>
        <ChevronRight size={12} className="text-slate-400" />
        <span className="text-[#FA6781]">{currentModule?.label}</span>
      </div>

      {/* Active Module Container */}
      {activeModule === "staff" ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
          <StaffManager />
        </div>
      ) : activeModule === "students" ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
          <StudentManager 
            selectedSession={selectedSession}
            onManageFees={(student) => {
              setPreselectedStudent(student);
              setActiveModule("fees");
            }} 
          />
        </div>
      ) : activeModule === "fees" ? (
        <div className="bg-white rounded-3xl border border-slate-200/60 p-4 sm:p-6 shadow-md w-full">
          <FeePortal 
            preselectedStudent={preselectedStudent} 
            clearPreselected={() => setPreselectedStudent(null)} 
            selectedSession={selectedSession}
            setActiveModule={setActiveModule}
          />
        </div>
      ) : activeModule === "transport" ? (
        <TransportPortal />
      ) : activeModule === "admissions" ? (
        <div className="bg-white rounded-3xl border border-slate-200/60 p-5 shadow-sm">
          <AdmissionsManager />
        </div>
      ) : activeModule === "settings" ? (
        <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-md">
          <SettingsPortal />
        </div>
      ) : (
        /* Custom Coming Soon page */
        <div className="bg-white rounded-2xl border border-slate-100 p-8 sm:p-12 text-center shadow-sm max-w-2xl mx-auto my-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: currentModule?.bg }}
          >
            {currentModule && React.createElement(currentModule.icon, { size: 30, style: { color: currentModule.color } })}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#093C5D] mb-3">
            {currentModule?.label}
          </h2>
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-4">
            <Wrench size={12} className="text-amber-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">Module Under Construction</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-8">
            {currentModule?.description} We are designing and coding this system with premium features for Neelgiri Public School. Stay tuned!
          </p>
          <button
            onClick={() => setActiveModule(null)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#093C5D] text-white rounded-xl text-xs font-bold border-0 cursor-pointer shadow-md hover:bg-[#001F42] transition active:scale-95"
          >
            <ArrowLeft size={14} /> Back to Overview
          </button>
        </div>
      )}
    </div>
  );
}
