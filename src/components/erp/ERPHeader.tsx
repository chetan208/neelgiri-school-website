'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  ArrowLeft,
} from "lucide-react";

export default function ERPHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#093C5D] shadow-lg border-b border-white/10">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Left — Logo + Title */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Back to website */}
          <button
            onClick={() => router.push("/admin")}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 transition cursor-pointer border-0 text-white"
            title="Back to Admin Panel"
          >
            <ArrowLeft size={15} />
          </button>

          <div className="flex items-center gap-2.5">
            <img
              src="/school_logo.png"
              alt="Neelgiri Public School Logo"
              className="w-9 h-9 rounded-full object-contain shadow-md shrink-0"
            />
            <div className="hidden sm:block">
              <p className="text-white font-black text-[13px] leading-none tracking-tight">
                Neelgiri ERP
              </p>
              <p className="text-white/50 text-[9px] font-semibold uppercase tracking-widest mt-0.5">
                School Management System
              </p>
            </div>
          </div>
        </div>

        {/* Center — System tag */}
        <div className="hidden md:flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#59B292] animate-pulse" />
          <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest">System Online</span>
        </div>

        {/* Right — Notifications + User */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Notification bell */}
          <button className="relative w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 transition cursor-pointer border-0 text-white">
            <Bell size={14} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FA6781]" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer border-0 text-white"
            >
              <div className="w-6 h-6 rounded-full bg-[#FFC94D] flex items-center justify-center text-[#093C5D] font-black text-[10px] overflow-hidden shrink-0">
                {user?.imageUrl
                  ? <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
                  : user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-[11px] font-bold max-w-[80px] truncate">
                {user?.name}
              </span>
              <ChevronDown size={11} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-20">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50">
                    <p className="text-xs font-black text-[#093C5D] truncate">{user?.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{user?.role}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { setDropdownOpen(false); router.push("/me"); }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer border-0 bg-transparent"
                    >
                      <User size={13} /> Profile
                    </button>
                    <button
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer border-0 bg-transparent"
                    >
                      <Settings size={13} /> Settings
                    </button>
                  </div>
                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition cursor-pointer border-0 bg-transparent"
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
