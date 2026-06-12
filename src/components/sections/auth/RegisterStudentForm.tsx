'use client';

import React from "react";
import Link from "next/link";
import { User, Mail, Lock } from "lucide-react";

interface RegisterStudentFormProps {
  setView: (view: "login" | "forgot" | "register") => void;
}

export default function RegisterStudentForm({ setView }: RegisterStudentFormProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setView("login"); }}>
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Full Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Student Name" required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50 focus:border-[#59B292]" />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="email" placeholder="student@neelgiri.edu" required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50 focus:border-[#59B292]" />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Create Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="password" placeholder="••••••••" required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50 focus:border-[#59B292]" />
          </div>
        </div>
        
        <div className="flex items-start gap-2 py-0.5 select-none">
          <input
            type="checkbox"
            id="studentAcceptTerms"
            required
            className="mt-0.5 w-3.5 h-3.5 accent-[#FA6781] border border-slate-300 rounded cursor-pointer"
          />
          <label htmlFor="studentAcceptTerms" className="text-[10px] text-slate-500 font-medium leading-snug cursor-pointer">
            I agree to the <Link href="/terms-conditions" target="_blank" className="text-[#093C5D] font-bold underline hover:text-[#FA6781]">Terms &amp; Conditions</Link> and <Link href="/school-policies" target="_blank" className="text-[#093C5D] font-bold underline hover:text-[#FA6781]">School Policies</Link> of the institution.
          </label>
        </div>

        <button type="submit" className="w-full mt-2 py-3 rounded-xl font-bold text-white bg-[#FA6781] shadow-md border-0 cursor-pointer text-xs transition-all hover:opacity-90">
          Sign Up as Student
        </button>
      </form>
    </div>
  );
}