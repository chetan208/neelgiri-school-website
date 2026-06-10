'use client';

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Settings, Mail, ShieldAlert, Loader2 } from "lucide-react";
import UpdateProfileForm from "./UpdateProfileForm";
import ProfileSettingsForm from "./ProfileSettingsForm";

export default function MyProfile() {
  const { user, authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "settings">("profile");

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#FA6781]" />
        <p className="text-xs text-[#06283D]/50 font-medium mt-2">Loading account info...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#093C5D]/10 max-w-sm w-full text-center">
          <ShieldAlert size={36} className="text-red-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-[#06283D]">Access Denied</h3>
          <p className="text-xs text-[#06283D]/60 mt-1">Please log in to view your profile dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#F8FAFC]/50 py-12 px-4 sm:px-6">
      <div className="max-w-[750px] mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Profile Identity Card */}
        <div className="bg-white border border-[#093C5D]/10 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-xl bg-[#093C5D] flex items-center justify-center font-bold text-xl text-white uppercase overflow-hidden shadow-inner shrink-0 border border-[#093C5D]/20">
              {user.imageUrl ? (
                <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-xl font-bold text-[#06283D] tracking-tight">{user.name}</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#FFC94D] text-[#093C5D] border border-[#093C5D]/10 uppercase">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-[#06283D]/50 mt-0.5 flex items-center gap-1"><Mail size={12}/>{user.email}</p>
            </div>
          </div>

          {/* Navigation Control */}
          <div className="flex bg-[#F8FAFC] border border-[#093C5D]/10 p-1 rounded-xl w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab("profile")}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 border-0 cursor-pointer ${activeTab === "profile" ? "bg-white text-[#06283D] shadow-sm" : "text-[#06283D]/50 bg-transparent hover:text-[#06283D]"}`}
            >
              <User size={13} /> Edit Profile
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 border-0 cursor-pointer ${activeTab === "settings" ? "bg-white text-[#06283D] shadow-sm" : "text-[#06283D]/50 bg-transparent hover:text-[#06283D]"}`}
            >
              <Settings size={13} /> Security Settings
            </button>
          </div>
        </div>

        {/* Dynamic Inner Form Injections */}
        {activeTab === "profile" ? <UpdateProfileForm /> : <ProfileSettingsForm />}

      </div>
    </div>
  );
}