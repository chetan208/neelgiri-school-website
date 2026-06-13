'use client';

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface LoginFormProps {
  setView: (view: "login" | "forgot" | "register") => void;
}

export default function LoginForm({ setView }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [studentIdentifier, setStudentIdentifier] = useState(""); 
  const [teacherIdentifier, setTeacherIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const { refreshUser } = useAuth();
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";

    try {
      if (role === "student") {
        const studentData = { role: "student", identifier: studentIdentifier, password };
        const res = await axios.post(`${SERVER_URL}/api/students/login`, studentData, { withCredentials: true });
        if (res.status === 200) {
          await refreshUser();
          router.push("/");
        }
      } else {
        const teacherData = { role: "teacher", email: teacherIdentifier, password };
        const res = await axios.post(`${SERVER_URL}/api/teachers/login`, teacherData, { withCredentials: true });
        if (res.status === 200) {
          await refreshUser();
          router.push("/");
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Invalid credentials. Please try again.");
      } else {
        setError(err instanceof Error ? err.message : "Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
        <p className="text-xs text-slate-500 mt-1">Sign in as {role === "student" ? "a Student/Parent" : "a Teacher"}</p>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
        <button 
          type="button"
          disabled={loading}
          onClick={() => { setRole("student"); setPassword(""); setError(""); }} 
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 border-0 cursor-pointer ${role === "student" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 bg-transparent disabled:opacity-50"}`}
        >
          <User size={14} /> Student
        </button>
        <button 
          type="button"
          disabled={loading}
          onClick={() => { setRole("teacher"); setPassword(""); setError(""); }} 
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 border-0 cursor-pointer ${role === "teacher" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 bg-transparent disabled:opacity-50"}`}
        >
          <GraduationCap size={14} /> Teacher
        </button>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 animate-in slide-in-from-top-2 duration-300">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div className="text-xs font-semibold leading-relaxed">{error}</div>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleLoginSubmit}>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {role === "student" ? "Student Email / Phone" : "Teacher Employee ID / Email"}
          </label>
          <div className="relative group">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#59B292] transition-colors" />
            <input 
              type="text" 
              disabled={loading}
              value={role === "student" ? studentIdentifier : teacherIdentifier}
              onChange={(e) => role === "student" ? setStudentIdentifier(e.target.value) : setTeacherIdentifier(e.target.value)}
              placeholder={role === "student" ? "Enter student email or phone" : "Enter employee ID or email"}
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#59B292] focus:ring-4 focus:ring-[#59B292]/10 outline-none text-xs transition-all bg-slate-50/50 disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-bold text-slate-700">Password</label>
            <button type="button" disabled={loading} onClick={() => setView("forgot")} className="text-xs font-bold text-[#FA6781] hover:text-[#093C5D] bg-transparent border-0 cursor-pointer disabled:opacity-50">Forgot?</button>
          </div>
          <div className="relative group">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#59B292] transition-colors" />
            <input 
              type={showPassword ? "text" : "password"} 
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 focus:border-[#59B292] focus:ring-4 focus:ring-[#59B292]/10 outline-none text-xs transition-all bg-slate-50/50 disabled:opacity-60"
            />
            <button 
              type="button" 
              disabled={loading}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer disabled:opacity-30"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full h-11 rounded-xl font-bold text-white bg-[#FA6781] hover:bg-[#093C5D] shadow-md transition-all mt-6 flex items-center justify-center gap-2 disabled:bg-[#FA6781]/70 disabled:cursor-not-allowed border-0 cursor-pointer text-xs"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <span>Sign In as {role === "student" ? "Student" : "Teacher"}</span>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500">
          Don&apos;t have an account?{" "}
          <button type="button" disabled={loading} onClick={() => setView("register")} className="text-[#FA6781] font-bold hover:underline bg-transparent border-0 cursor-pointer disabled:opacity-50">Sign up</button>
        </p>
      </div>
    </div>
  );
}