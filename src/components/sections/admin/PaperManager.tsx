'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Upload, Trash2, Loader2, X, PlusCircle, Calendar, AlertTriangle, RefreshCw, CheckCircle2, Info } from "lucide-react";
import { PaperType } from "../../../../app/prevous-years-papers/page";

export default function PaperManager() {
  const classesAvailable = ["12", "11", "10", "9", "8", "7", "6"];
  const [papers, setPapers] = useState<PaperType[]>([]);
  const [selectedClassTab, setSelectedClassTab] = useState("10");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | number | null>(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [formData, setFormData] = useState({ subject: "", year: "", term: "", className: "10" });
  const [file, setFile] = useState<File | null>(null);

  const showToast = (message: string, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  const fetchPapersByClass = async (className: string) => {
    setLoading(true);
    setError("");
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
    try {
      const response = await axios.get(`${SERVER_URL}/api/pyqs/${className}`);
      if (response.data && response.data.pyqs) {
        setPapers(response.data.pyqs);
      } else {
        setPapers([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load papers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapersByClass(selectedClassTab);
  }, [selectedClassTab]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return showToast("Please select a PDF file.", "error");

    setActionLoading(true);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
    const dataPayload = new FormData();
    dataPayload.append("subject", formData.subject);
    dataPayload.append("year", formData.year);
    dataPayload.append("term", formData.term);
    dataPayload.append("file", file);

    try {
      const response = await axios.post(
        `${SERVER_URL}/api/pyqs/add/${formData.className}`,
        dataPayload,
        { withCredentials: true }
      );

      if (response.status === 200) {
        showToast("PYQ uploaded successfully!", "success");
        setIsModalOpen(false);
        setFormData({ subject: "", year: "", term: "", className: "10" });
        setFile(null);
        if (formData.className === selectedClassTab) {
          fetchPapersByClass(selectedClassTab);
        } else {
          setSelectedClassTab(formData.className);
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || "Upload error.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDeletePaper = async () => {
    if (!deleteTargetId) return;
    setActionLoading(true);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
    try {
      const response = await axios.delete(`${SERVER_URL}/api/pyqs/delete/${deleteTargetId}`, { withCredentials: true });
      if (response.status === 200) {
        setPapers((prev) => prev.filter((p) => p.id !== deleteTargetId));
        showToast("Paper removed successfully.", "success");
      }
    } catch (error) {
      showToast("Unable to delete file.", "error");
    } finally {
      setActionLoading(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto p-3 sm:p-6 relative text-slate-800 antialiased">
      {toast.show && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl border w-[90vw] sm:w-auto max-w-sm ${
          toast.type === "error" ? "bg-red-50 border-red-100 text-red-700" : "bg-[#59B292]/10 border-[#59B292]/20 text-[#59B292]"
        }`}>
          {toast.type === "error" ? <AlertTriangle size={16} className="shrink-0" /> : <CheckCircle2 size={16} className="shrink-0" />}
          <span className="text-xs font-bold tracking-wide break-words">{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 font-serif">Manage Question Papers</h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Control archived document structures across student classes.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto justify-center bg-[#093C5D] hover:bg-[#FA6781] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-3xs border-0 cursor-pointer"><PlusCircle size={14} /> Add New PYQ</button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
        {classesAvailable.map((cls) => (
          <button
            key={cls}
            type="button"
            onClick={() => setSelectedClassTab(cls)}
            className={`px-5 py-2 text-xs font-bold transition-all rounded-lg border cursor-pointer ${
              selectedClassTab === cls ? "bg-[#093C5D] border-[#093C5D] text-white font-black" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >Class {cls}</button>
        ))}
      </div>

      {error ? (
        <div className="text-center p-5 max-w-sm mx-auto"><button onClick={() => fetchPapersByClass(selectedClassTab)} className="bg-red-600 text-white p-2 text-xs rounded-lg border-0 cursor-pointer"><RefreshCw size={12} /> Retry</button></div>
      ) : loading ? (
        <div className="flex justify-center py-20 bg-white border border-slate-200 rounded-xl"><Loader2 className="animate-spin text-slate-400" size={24} /></div>
      ) : papers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {papers.map((paper) => (
            <div key={paper.id} className="bg-white p-3.5 border border-slate-200 rounded-xl flex items-center justify-between gap-4 shadow-3xs">
              <div className="min-w-0 flex-1 space-y-1">
                <h3 className="text-xs font-bold text-slate-800 truncate capitalize">{paper.subject}</h3>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                  <span className="flex items-center gap-0.5"><Calendar size={11}/> {paper.year}</span>
                  <span>•</span>
                  <span className="capitalize truncate">{paper.term}</span>
                </div>
              </div>
              <button disabled={actionLoading} onClick={() => setDeleteTargetId(paper.id)} className="text-slate-300 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-lg transition-all cursor-pointer bg-transparent border-0"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-white border border-slate-200 rounded-xl text-xs text-slate-400 italic">No past papers uploaded yet.</div>
      )}

      {/* --- ADD UPLOAD FORM MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#06283D]/40 backdrop-blur-3xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold flex items-center gap-1.5">
                <Upload size={14} className="text-[#093C5D]" /> Upload New Past Paper
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 border-0 bg-transparent cursor-pointer"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Class</label>
                  <select 
                    value={formData.className} 
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-lg outline-none cursor-pointer"
                  >
                    {classesAvailable.map((c) => (
                      <option key={c} value={c}>Class {c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Session Year</label>
                  <input type="number" required placeholder="e.g., 2025" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-lg outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subject Name</label>
                <input type="text" required placeholder="e.g., Mathematics" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Evaluation Term</label>
                <input type="text" required placeholder="e.g., Final Term" value={formData.term} onChange={(e) => setFormData({ ...formData, term: e.target.value })} className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-lg outline-none" />
              </div>
              <div className="border border-dashed border-slate-200 bg-slate-50/50 p-4 rounded-xl text-center relative">
                <input type="file" accept=".pdf" required onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                <Info size={18} className="mx-auto text-slate-300 mb-1.5" />
                <p className="text-xs font-bold text-slate-600 truncate">{file ? file.name : "Select Target PDF File"}</p>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs bg-white cursor-pointer">Cancel</button>
                <button type="submit" disabled={actionLoading} className="px-4 py-2 bg-[#FA6781] hover:bg-[#093C5D] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border-0 cursor-pointer shadow-xs">
                  {actionLoading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                  <span>Publish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- RE-ADDED MISSING DELETE CONFIRMATION POPUP MODAL --- */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06283D]/40 backdrop-blur-3xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto bg-rose-50 text-rose-600 w-12 h-12 rounded-full flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Question Paper?</h3>
              <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">Are you absolutely sure you want to remove this record? This action cannot be undone.</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={confirmDeletePaper}
                disabled={actionLoading}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition border-0 cursor-pointer flex items-center justify-center gap-1"
              >
                {actionLoading && <Loader2 size={12} className="animate-spin" />}
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                disabled={actionLoading}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition border-0 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}