'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Mail, ShieldCheck, Book, UploadCloud, GraduationCap, FileText, ArrowLeft, Loader2, AlertCircle, X, Maximize2, Eye, EyeOff, Lock } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterTeacherForm() {
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  
  const [qualification, setQualification] = useState("");
  const [subject, setSubject] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const { refreshUser } = useAuth();

  const [loadingText, setLoadingText] = useState("Please wait...");
  const loadingPhrases = [
    "Uploading profile image...",
    "Processing your details...",
    "Creating secure teacher account...",
    "Finalizing profile registration..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading && step === 3) {
      let index = 0;
      setLoadingText(loadingPhrases[0]);
      interval = setInterval(() => {
        index = (index + 1) % loadingPhrases.length;
        setLoadingText(loadingPhrases[index]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading, step]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const signupData = { name, email };
      const res = await axios.post(`${SERVER_URL}/api/teachers`, signupData);
      if (res.status === 200 || res.status === 201) setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const verifyData = { email, otp };
      const res = await axios.post(`${SERVER_URL}/api/teachers/verify-otp`, verifyData, { withCredentials: true });
      if (res.status === 200) setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP code. Please check again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please enter again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("qualification", qualification);
      formData.append("subject", subject);
      formData.append("bio", bio);
      formData.append("password", password);
      if (imageFile) formData.append("image", imageFile);

      const res = await axios.post(`${SERVER_URL}/api/teachers/complete-profile`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.status === 200) {
        await refreshUser();
        router.push("/"); 
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden relative">
      {step > 1 && !loading && (
        <button 
          type="button"
          onClick={() => { setStep(step - 1); setError(""); }}
          className="text-xs font-semibold text-[#06283D]/60 hover:text-[#FFC94D] flex items-center gap-1 mb-4 border-0 bg-transparent cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Step {step - 1}
        </button>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p className="text-xs font-semibold">{error}</p>
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Teacher Name" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Work Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@neelgiri.edu" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50/50" />
            </div>
          </div>
          
          <div className="flex items-start gap-2 py-0.5 select-none">
            <input
              type="checkbox"
              id="teacherAcceptTerms"
              required
              className="mt-0.5 w-3.5 h-3.5 accent-[#093C5D] border border-slate-300 rounded cursor-pointer"
            />
            <label htmlFor="teacherAcceptTerms" className="text-[10px] text-slate-500 font-medium leading-snug cursor-pointer">
              I agree to the <Link href="/terms-conditions" target="_blank" className="text-[#093C5D] font-bold underline hover:text-[#FA6781]">Terms &amp; Conditions</Link> and <Link href="/school-policies" target="_blank" className="text-[#093C5D] font-bold underline hover:text-[#FA6781]">School Policies</Link> of the institution.
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold text-white bg-[#093C5D] hover:bg-[#001F42] transition-all mt-2 flex items-center justify-center gap-2 border-0 cursor-pointer text-xs">
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#093C5D]/20 flex gap-3">
             <ShieldCheck className="text-[#FA6781] shrink-0" />
             <div>
               <p className="text-xs text-[#093C5D] font-bold">Verification Sent</p>
               <p className="text-[11px] text-[#06283D] mt-0.5">Enter the OTP sent to {email}</p>
             </div>
          </div>
          <div>
            <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} required placeholder="000000" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-center tracking-[0.5em] font-bold text-base outline-none focus:border-[#59B292] bg-slate-50/50" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold text-white bg-[#FA6781] hover:bg-[#093C5D] transition-all mt-2 flex items-center justify-center gap-2 border-0 cursor-pointer text-xs">
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Verify OTP"}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleCompleteProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5"><GraduationCap size={12} className="inline mr-1"/>Qualification</label>
              <input type="text" value={qualification} onChange={e => setQualification(e.target.value)} required placeholder="M.Sc Mathematics" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#59B292]" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5"><Book size={12} className="inline mr-1"/>Subject</label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required placeholder="Mathematics" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#59B292]" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5"><FileText size={12} className="inline mr-1"/>Short Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} required placeholder="Experience details..." rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#59B292] resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1"><Lock size={12}/>Set Password</label>
              <div className="relative group">
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="********" className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#59B292]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1"><Lock size={12}/>Confirm Password</label>
              <div className="relative group">
                <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="********" className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#59B292]" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer">
                  {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-medium italic mt-[-8px]">Remember this password for the future login.</p>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Profile Image</label>
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 hover:border-[#59B292] transition-all">
                <div className="flex flex-col items-center justify-center pt-2 pb-3 text-center">
                  <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                  <p className="text-xs text-slate-500 font-medium">Click to upload image</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            ) : (
              <div className="relative w-full h-24 rounded-xl border border-slate-200 bg-slate-50 p-2 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div onClick={() => setIsModalOpen(true)} className="relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer shadow-xs">
                    <img src={imagePreview} alt="Preview thumbnail" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Maximize2 size={14} className="text-white" />
                    </div>
                  </div>
                  <div className="max-w-[180px]">
                    <p className="text-xs font-bold text-slate-700 truncate">{imageFile?.name}</p>
                    <p className="text-[10px] text-slate-400">{imageFile ? (imageFile.size / 1024).toFixed(1) : 0} KB</p>
                  </div>
                </div>
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(""); }} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-red-500 flex items-center justify-center transition-colors shadow-xs cursor-pointer"><X size={15} /></button>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full h-11 rounded-xl font-bold text-white bg-[#FA6781] shadow-md flex items-center justify-center gap-2 border-0 cursor-pointer text-xs disabled:opacity-85 mt-4">
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs font-medium animate-pulse">{loadingText}</span>
              </>
            ) : (
              <span>Complete Profile Registration</span>
            )}
          </button>
        </form>
      )}

      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div onClick={(e) => e.stopPropagation()} className="relative max-w-lg w-full bg-white rounded-2xl p-2 shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black flex items-center justify-center transition-colors border-0 cursor-pointer"><X size={16} /></button>
            <div className="w-full overflow-hidden rounded-xl max-h-[70vh]">
              <img src={imagePreview} alt="Full profile preview" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}