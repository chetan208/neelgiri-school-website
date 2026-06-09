'use client';

import React, { useState } from "react";
import axios from "axios";
import { ArrowLeft, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import ClassSelection from "@/components/sections/pyqs/ClassSelection";
import SubjectSelection from "@/components/sections/pyqs/SubjectSelection";
import PaperList from "@/components/sections/pyqs/PaperList";

export interface PaperType {
  id: string | number;
  subject: string;
  year: string;
  term: string;
  fileUrl: string;
}

export default function PYQArchivePage() {
  const [step, setStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [papers, setPapers] = useState<PaperType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClassSelect = async (cls: string) => {
    setSelectedClass(cls);
    setLoading(true);
    setError("");
    
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
    try {
      const response = await axios.get(`${SERVER_URL}/api/pyqs/${cls}`);
      if (response.data && response.data.pyqs) {
        setPapers(response.data.pyqs);
        setStep(2);
      } else {
        setError("Invalid response format.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased py-8">
      <main className="max-w-4xl mx-auto px-4">
        
        {/* HEADER BLOCK */}
        <div className="text-center mb-10 mt-4 animate-in fade-in slide-in-from-top-3 duration-500">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold tracking-wider uppercase mb-3">
            Academic Resource
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 font-serif">
            Past Examination Hub
          </h1>
          <p className="max-w-md mx-auto text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Your direct gateway to verified previous year question papers. Select your class and subject below to boost your exam preparation.
          </p>
        </div>

        {/* BACK NAVIGATION */}
        {step > 1 && !loading && !error && (
          <button
            onClick={() => setStep(step - 1)}
            className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-3xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} /> Back
          </button>
        )}

        {/* ERROR STATE */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-sm mx-auto">
            <AlertTriangle size={20} className="text-red-600 mx-auto mb-2" />
            <p className="text-xs text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={() => { setError(""); setStep(1); }}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer border-0"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-24 bg-white border border-slate-200 rounded-xl shadow-3xs">
            <Loader2 className="animate-spin text-slate-600" size={24} />
          </div>
        ) : (
          <>
            {step === 1 && <ClassSelection onSelectClass={handleClassSelect} />}
            {step === 2 && <SubjectSelection papers={papers} onSelectSubject={handleSubjectSelect} />}
            {step === 3 && <PaperList selectedSubject={selectedSubject} papers={papers} />}
          </>
        )}
      </main>
    </div>
  );
}