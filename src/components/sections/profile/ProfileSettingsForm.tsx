'use client';

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Lock, Loader2, AlertCircle, CheckCircle, ShieldCheck } from "lucide-react";
import axios from "axios";

export default function ProfileSettingsForm() {
  const { user } = useAuth();
  const [subView, setSubView] = useState<"init" | "reset_step">("init");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";

  const triggerForgotAPI = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        `${SERVER_URL}/api/teachers/forgot-password`,
        { email: user?.email }
      );
      if (res.status === 200) {
        setSuccess("Verification OTP triggered successfully to your account email.");
        setSubView("reset_step");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to trigger automated verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResultPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${SERVER_URL}/api/teachers/reset-password`,
        { email: user?.email, otp, newPassword }
      );
      if (res.status === 200) {
        setSuccess("Your account credentials updated successfully.");
        setSubView("init");
        setOtp("");
        setNewPassword("");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Token authorization matching failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#093C5D]/10 rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] animate-fade-in max-w-md">
      <div className="mb-6">
        <h2 className="text-base font-bold text-[#06283D]">Security Credentials</h2>
        <p className="text-xs text-[#06283D]/60 mt-0.5">Modify access parameters safely through explicit secure verification.</p>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-[#59B292]/10 border border-[#59B292]/20 text-[#59B292] rounded-xl flex items-start gap-2 text-xs font-semibold">
          <CheckCircle size={16} className="shrink-0 mt-0.5"/> <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-start gap-2 text-xs font-semibold">
          <AlertCircle size={16} className="shrink-0 mt-0.5"/> <span>{error}</span>
        </div>
      )}

      {subView === "init" ? (
        <div className="space-y-4">
          <p className="text-xs font-medium text-[#06283D]/75 leading-relaxed">
            To change or update your profile password parameters, click below to trigger a 6-digit secure token validation link.
          </p>
          <button 
            type="button" 
            onClick={triggerForgotAPI} 
            disabled={loading}
            className="w-full bg-[#093C5D] hover:bg-[#FA6781] text-white font-bold text-xs py-3.5 rounded-xl border-0 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin"/> : "Change Password"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleResultPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#06283D] mb-1.5">Enter Token OTP</label>
            <input 
              type="text" 
              maxLength={6} 
              value={otp} 
              onChange={e=>setOtp(e.target.value)} 
              placeholder="000000" 
              required 
              className="w-full bg-[#F8FAFC]/50 border border-[#093C5D]/20 rounded-xl p-3 text-center tracking-widest font-bold text-base outline-none focus:border-[#093C5D] transition-all" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#06283D] mb-1.5 flex items-center gap-1"><Lock size={13}/>New Password String</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={e=>setNewPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
              className="w-full bg-[#F8FAFC]/50 border border-[#093C5D]/20 rounded-xl p-3 text-xs outline-none focus:border-[#FFC94D] focus:ring-2 focus:ring-[#FFC94D]/10 transition-all" 
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading} className="flex-1 bg-[#FA6781] hover:bg-[#093C5D] text-white font-bold text-xs py-3 rounded-xl border-0 cursor-pointer shadow-md shadow-[#FA6781]/10 flex items-center justify-center gap-1.5">
              {loading ? <Loader2 size={14} className="animate-spin"/> : <ShieldCheck size={14}/>}
              Verify &amp; Complete Reset
            </button>
            <button type="button" onClick={() => { setSubView("init"); setError(""); setSuccess(""); }} className="px-4 py-3 bg-[#F8FAFC] text-[#06283D] hover:bg-[#093C5D]/10 rounded-xl text-xs font-bold border-0 cursor-pointer">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}