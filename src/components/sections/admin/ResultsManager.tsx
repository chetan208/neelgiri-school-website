'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trophy, Plus, Trash2, ShieldAlert, Loader2, RefreshCw } from "lucide-react";

interface TopResult {
  id: string;
  studentName: string;
  className: string;
  marks: string;
  parentsName: string;
  imageUrl?: string;
  imagePublicId?: string;
  createdAt: string;
}

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8000";

export default function ResultsManager() {
  const [results, setResults] = useState<TopResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [studentName, setStudentName] = useState("");
  const [className, setClassName] = useState("");
  const [marks, setMarks] = useState("");
  const [parentsName, setParentsName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<TopResult[]>(`${SERVER_URL}/api/top-results`);
      setResults(res.data);
    } catch (err) {
      console.error("Failed to load top results", err);
      setError("Unable to load top performers. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !className || !marks || !parentsName) {
      setError("All fields are required");
      return;
    }

    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("studentName", studentName);
    formData.append("className", className);
    formData.append("marks", marks);
    formData.append("parentsName", parentsName);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await axios.post(`${SERVER_URL}/api/top-results`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });
      setResults((prev) => [res.data, ...prev]);
      // Reset form
      setStudentName("");
      setClassName("");
      setMarks("");
      setParentsName("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      console.error("Failed to add top result", err);
      setError(err.response?.data?.error ?? "Failed to save result. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this top performer record?")) return;

    setError(null);
    try {
      await axios.delete(`${SERVER_URL}/api/top-results/${id}`, {
        withCredentials: true
      });
      setResults((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete top result", err);
      setError("Failed to delete the record. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#FA6781]">
            <Trophy size={18} className="shrink-0" />
            <h2 className="text-lg font-bold text-slate-800 leading-tight">Manage Top Performers</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">Add and manage the top academic results of Neelgiri Public School.</p>
        </div>
        <button
          onClick={fetchResults}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#093C5D] bg-[#093C5D]/5 hover:bg-[#093C5D]/10 rounded-lg cursor-pointer border-0 transition"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-600 font-semibold leading-relaxed">
          <ShieldAlert size={14} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* FORM AND TABLE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ADD FORM */}
        <form onSubmit={handleSubmit} className="lg:col-span-5 bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-[#093C5D] border-b border-slate-50 pb-2">Add New Result</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Student Name</label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Kamana Chaudhary"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#093C5D] focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Class Name</label>
              <input
                type="text"
                required
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g. Class 10"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#093C5D] focus:bg-white transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Marks / Score</label>
              <input
                type="text"
                required
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="e.g. 95% or 98.6%"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#093C5D] focus:bg-white transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Parent's Name</label>
            <input
              type="text"
              required
              value={parentsName}
              onChange={(e) => setParentsName(e.target.value)}
              placeholder="Father's or Mother's name"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#093C5D] focus:bg-white transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Student Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
                if (file) {
                  setImagePreview(URL.createObjectURL(file));
                } else {
                  setImagePreview(null);
                }
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#093C5D] focus:bg-white transition file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-extrabold file:bg-[#093C5D]/10 file:text-[#093C5D] file:cursor-pointer"
            />
            {imagePreview && (
              <div className="mt-2 relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#FA6781] hover:bg-[#093C5D] text-white text-xs font-bold border-0 cursor-pointer transition shadow-xs"
          >
            {submitting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Plus size={13} />
            )}
            Save Record
          </button>
        </form>

        {/* RESULTS TABLE */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-[#093C5D]">Performers Directory</h3>
            <span className="text-[10px] font-bold bg-[#093C5D]/10 px-2 py-0.5 rounded-full text-[#093C5D]">{results.length} total</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
              <Loader2 size={24} className="animate-spin text-slate-400" />
              <p className="text-xs">Fetching performer lists...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3">Student / Parent</th>
                    <th className="px-4 py-3">Class</th>
                    <th className="px-4 py-3">Marks</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((result) => (
                    <tr key={result.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {result.imageUrl ? (
                            <img src={result.imageUrl} alt={result.studentName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#093C5D]/5 text-[#093C5D] flex items-center justify-center font-bold text-xs shrink-0 border border-[#093C5D]/10">
                              {result.studentName[0].toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-800">{result.studentName}</div>
                            <div className="text-[10px] text-slate-400 font-medium">Parents: {result.parentsName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{result.className}</td>
                      <td className="px-4 py-3 font-black text-[#FA6781]">{result.marks}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(result.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 border-0 bg-transparent cursor-pointer transition"
                          title="Delete record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <Trophy size={32} className="mx-auto text-slate-200 mb-2" />
              <p className="text-xs">No top results found. Add your first record!</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
