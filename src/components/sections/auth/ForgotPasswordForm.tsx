'use client';

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Mail, KeyRound, Lock, ArrowLeft, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";

interface ForgotPasswordFormProps {
  setView: (view: "login" | "forgot" | "register") => void;
}

export default function ForgotPasswordForm({ setView }: ForgotPasswordFormProps) {
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${SERVER_URL}/api/teachers/forgot-password`, { email });
      if (res.status === 200) setStep(2);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const resetPayload = { email, otp, newPassword };
      const res = await axios.post(`${SERVER_URL}/api/teachers/reset-password`, resetPayload);
      if (res.status === 200) setShowSuccessModal(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Invalid OTP or request failed.");
      } else {
        setError(err instanceof Error ? err.message : "Invalid OTP or request failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-up relative">
      {!loading && (
        <button 
          type="button" 
          onClick={() => { setError(""); if (step === 2) { setStep(1); } else { setView("login"); } }} 
          className="text-xs font-bold text-slate-500 hover:text-[#FA6781] flex items-center gap-1 mb-4 transition-colors bg-transparent border-0 cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to {step === 2 ? "Email Step" : "Login"}
        </button>
      )}

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reset Password</h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          {step === 1 ? "Enter your registered email address" : "Enter OTP and set your new password"}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 animate-in fade-in duration-300">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p className="text-xs font-semibold leading-relaxed">{error}</p>
        </div>
      )}

      {step === 1 ? (
        <form className="space-y-4" onSubmit={handleSendOTP}>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative group">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#59B292] transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@neelgiri.edu"
                required
                disabled={loading}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#59B292] outline-none text-xs bg-slate-50/50 disabled:opacity-60"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full mt-6 h-11 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center justify-center gap-2 border-0 cursor-pointer text-xs">
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Send OTP"}
          </button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleResetPassword}>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Enter OTP</label>
            <div className="relative group">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#59B292] transition-colors" />
              <input type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit OTP" required disabled={loading} className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#59B292] text-xs bg-slate-50/50" />
            </div>
          </div>
          
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">New Password</label>
            <div className="relative group">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#59B292] transition-colors" />
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" required disabled={loading} className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#59B292] text-xs bg-slate-50/50" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Confirm Password</label>
            <div className="relative group">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#59B292] transition-colors" />
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required disabled={loading} className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#59B292] text-xs bg-slate-50/50" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full h-11 rounded-xl font-bold text-white bg-[#FA6781] shadow-md flex items-center justify-center gap-2 border-0 cursor-pointer text-xs">
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Verify &amp; Reset Password"}
          </button>
        </form>
      )}

      {showSuccessModal && createPortal(
        <div className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in highway-fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 text-center shadow-2xl border border-slate-100">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <CheckCircle size={30} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Success!</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">Your password has been reset successfully. You can now log in with your new password.</p>
            <button type="button" onClick={() => { setShowSuccessModal(false); setView("login"); }} className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold border-0 cursor-pointer shadow-xs">Continue to Sign In</button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}