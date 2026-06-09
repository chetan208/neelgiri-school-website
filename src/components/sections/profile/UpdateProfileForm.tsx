'use client';

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Book, GraduationCap, FileText, User, Loader2, AlertCircle, CheckCircle, X } from "lucide-react";
import axios from "axios";

export default function UpdateProfileForm() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isTeacher = user?.role === "Teacher" || user?.role === "Admin" || user?.role === "Owner";
  const [name, setName] = useState(user?.name || "");
  const [qualification, setQualification] = useState(user?.qualification || "");
  const [subject, setSubject] = useState(user?.subject || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState(user?.imageUrl || "");

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImgPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";

    try {
      if (isTeacher) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("qualification", qualification);
        formData.append("subject", subject);
        formData.append("bio", bio);
        if (imageFile) formData.append("image", imageFile);

        const res = await axios.post(
          `${SERVER_URL}/api/teachers/complete-profile`,
          formData,
          { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
        );

        if (res.status === 200) {
          setSuccess("Profile updated successfully!");
          refreshUser();
        }
      } else {
        await axios.put(`${SERVER_URL}/api/students/update`, { 
          name, qualification, subject, bio 
        }, { withCredentials: true });
        
        setSuccess("Profile settings saved.");
        refreshUser();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile parameters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] animate-fade-in relative">
      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <button className="absolute top-5 right-5 text-white p-2 hover:bg-white/10 rounded-full border-0 bg-transparent cursor-pointer" onClick={() => setIsModalOpen(false)}><X size={24}/></button>
          <img src={imgPreview} alt="Full view" className="max-h-[80vh] max-w-full rounded-xl shadow-2xl" />
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
        <p className="text-xs text-slate-400 mt-0.5">Keep your account details verified and up to date.</p>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle size={16}/> {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <AlertCircle size={16}/> {error}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-5">
        
        {/* Avatar Selection Tier */}
        <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <div 
            className="w-14 h-14 rounded-xl bg-slate-200 overflow-hidden shrink-0 border border-slate-100 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => imgPreview && setIsModalOpen(true)}
          >
            {imgPreview ? (
              <img src={imgPreview} className="w-full h-full object-cover" alt="Avatar"/>
            ) : (
              <div className="w-full h-full bg-teal-600 flex items-center justify-center text-white font-bold text-lg">
                {name ? name.charAt(0).toUpperCase() : <User size={24}/>}
              </div>
            )}
          </div>
          <label className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-50 shadow-sm transition-all">
            Change Profile Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleImgChange} />
          </label>
        </div>

        {/* Form Inputs Container */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
            <User size={13} /> Full Name
          </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
              <GraduationCap size={13} /> Qualification
            </label>
            <input type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
              <Book size={13} /> Subject Expert
            </label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
            <FileText size={13} /> Biography
          </label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 resize-none transition-all" />
        </div>

        <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 border-0 cursor-pointer transition-all flex items-center gap-2 shadow-md shadow-teal-600/10">
          {loading ? <Loader2 size={14} className="animate-spin" /> : "Save Profile Changes"}
        </button>
      </form>
    </div>
  );
}