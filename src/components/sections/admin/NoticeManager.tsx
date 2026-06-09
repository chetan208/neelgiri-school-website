'use client';

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Upload, Loader2, FileText, CheckCircle2, AlertTriangle, X } from "lucide-react";
import axios from "axios";

interface DBNoticeType {
  id: string | number;
  type: string;
  title: string;
  description: string;
  documentUrl?: string;
}

export default function NoticeManager() {
  const [notices, setNotices] = useState<DBNoticeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false); 
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const [formData, setFormData] = useState({ type: "urgent", title: "", description: "" });
  const [file, setFile] = useState<File | null>(null);

  const [popup, setPopup] = useState<{
    show: boolean;
    type: "success" | "confirm" | string;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
  }>({ show: false, type: "success", title: "", message: "", onConfirm: null });

  const triggerSuccessPopup = (title: string, message: string) => {
    setPopup({ show: true, type: "success", title, message, onConfirm: null });
  };

  const triggerConfirmPopup = (title: string, message: string, onConfirmAction: () => void) => {
    setPopup({ show: true, type: "confirm", title, message, onConfirm: onConfirmAction });
  };

  const closePopup = () => {
    if (deleteLoading) return; 
    setPopup(prev => ({ ...prev, show: false }));
  };

  const fetchNotices = async () => {
    setLoading(true);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
    try {
      const res = await axios.get(`${SERVER_URL}/api/notices`);
      setNotices(res.data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";

    const data = new FormData();
    data.append("type", formData.type);
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (file) data.append("document", file);

    try {
      if (editingId) {
        await axios.put(`${SERVER_URL}/api/notices/${editingId}`, data);
        triggerSuccessPopup("Notice Updated", "The selected notice has been updated successfully.");
      } else {
        await axios.post(`${SERVER_URL}/api/notices/create-notice`, data);
        triggerSuccessPopup("Notice Published", "A new official notice has been registered and broadcasted.");
      }
      resetForm();
      fetchNotices();
    } catch (error) {
      console.error("Error saving notice:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = (id: string | number) => {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
    triggerConfirmPopup(
      "Delete Notice",
      "Are you absolutely sure you want to remove this notice? This action cannot be undone.",
      async () => {
        setDeleteLoading(true); 
        try {
          await axios.delete(`${SERVER_URL}/api/notices/${id}`);
          setNotices(notices.filter((n) => n.id !== id));
          setDeleteLoading(false); 
          closePopup();
          setTimeout(() => {
            triggerSuccessPopup("Deleted Successfully", "The notice record has been permanently deleted.");
          }, 200);
        } catch (error) {
          console.error("Error deleting notice:", error);
          setDeleteLoading(false);
        }
      }
    );
  };

  const startEdit = (notice: DBNoticeType) => {
    setEditingId(notice.id);
    setFormData({ type: notice.type.toLowerCase(), title: notice.title, description: notice.description });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ type: "urgent", title: "", description: "" });
    setFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6 relative text-slate-800">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">Manage School Notices</h2>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition shadow-2xs border-0 cursor-pointer"
          >
            <Plus size={16} /> Add New Notice
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">{editingId ? "Edit Notice Details" : "Create New Document Notice"}</h3>
            <button type="button" onClick={resetForm} className="text-xs sm:text-sm font-bold text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer">Cancel</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Notice Tier Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm rounded-lg focus:outline-none focus:border-emerald-600 font-medium transition cursor-pointer"
              >
                <option value="urgent">Urgent</option>
                <option value="academic">Academic</option>
                <option value="careers">Careers</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Notice Header Title</label>
              <input
                type="text"
                required
                placeholder="e.g., Mandatory Document Verification Notice"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm rounded-lg focus:outline-none focus:border-emerald-600 font-medium transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Detailed Description Body</label>
            <textarea
              required
              rows={4}
              placeholder="Provide complete breakdown insights regarding this alert publication..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm rounded-lg focus:outline-none focus:border-emerald-600 font-medium transition resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Attach Document PDF {editingId && <span className="text-amber-600 font-bold normal-case">(Keep empty to preserve current document)</span>}
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100/50 transition-all">
                <div className="flex flex-col items-center justify-center pt-4 pb-4">
                  <Upload size={20} className="text-slate-400 mb-1.5" />
                  <p className="text-xs sm:text-sm font-bold text-slate-600">{file ? file.name : "Click to browse notice file attachment"}</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                  required={!editingId} 
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-70 shadow-2xs border-0 cursor-pointer"
          >
            {submitLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {submitLoading ? "Processing File Pipelines..." : editingId ? "Update Live Publication" : "Publish Official Notice"}
          </button>
        </form>
      )}

      <div className="space-y-2.5">
        {loading ? (
          <div className="w-full bg-white border border-slate-200 rounded-xl p-5 animate-pulse h-20" />
        ) : notices.length > 0 ? (
          notices.map((notice) => (
            <div key={notice.id} className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition group">
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                    notice.type.toLowerCase() === "urgent" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}>
                    {notice.type}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">{notice.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">{notice.description}</p>
                {notice.documentUrl && (
                  <a href={notice.documentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline mt-1.5 no-underline">
                    <FileText size={12} /> View Linked PDF Document
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1.5 sm:self-center self-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 w-full sm:w-auto justify-end">
                <button onClick={() => startEdit(notice)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition bg-transparent border-0 cursor-pointer"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(notice.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition bg-transparent border-0 cursor-pointer"><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-10 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-medium">No notices published yet.</div>
        )}
      </div>

      {popup.show && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-150 relative">
            <button onClick={closePopup} disabled={deleteLoading} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition disabled:opacity-50 border-0 bg-transparent cursor-pointer"><X size={16} /></button>
            {popup.type === "success" ? (
              <div className="mx-auto bg-emerald-50 text-emerald-600 w-12 h-12 rounded-full flex items-center justify-center"><CheckCircle2 size={24} /></div>
            ) : (
              <div className="mx-auto bg-rose-50 text-rose-600 w-12 h-12 rounded-full flex items-center justify-center"><AlertTriangle size={24} /></div>
            )}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">{popup.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1 leading-relaxed">{popup.message}</p>
            </div>
            <div className="flex gap-2 pt-2">
              {popup.type === "confirm" ? (
                <>
                  <button onClick={popup.onConfirm ?? undefined} disabled={deleteLoading} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs sm:text-sm font-bold transition shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-75 border-0 cursor-pointer">{deleteLoading && <Loader2 size={14} className="animate-spin" />}<span>Delete</span></button>
                  <button onClick={closePopup} disabled={deleteLoading} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs sm:text-sm font-bold transition disabled:opacity-50 border-0 cursor-pointer">Cancel</button>
                </>
              ) : (
                <button onClick={closePopup} className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs sm:text-sm font-bold transition border-0 cursor-pointer">Acknowledge</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}