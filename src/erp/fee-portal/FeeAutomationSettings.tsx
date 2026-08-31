'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Activity, Play, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

export default function FeeAutomationSettings() {
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    checkStatus();
    // Poll every 3 seconds to check if background job is still running
    const interval = setInterval(() => {
      checkStatus();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/erp/fee-automation/status`, { withCredentials: true });
      if (res.data.success) {
        setIsRunning(res.data.isRunning);
      }
    } catch (error) {
      console.error("Failed to check status", error);
    }
  };

  const executeTrigger = async () => {
    setShowConfirmModal(false);
    setIsTriggering(true);
    setMessage(null);
    try {
      const res = await axios.post(`${SERVER_URL}/api/erp/fee-automation/trigger`, {}, { withCredentials: true });
      if (res.data.success) {
        setIsRunning(true);
        setMessage({ type: "info", text: "Fee generation has started! The server is processing students in the background." });
      }
    } catch (error: any) {
      console.error("Failed to trigger manual automation", error);
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to trigger automation." 
      });
      setIsTriggering(false);
    }
  };

  const handleTriggerNow = () => {
    setShowConfirmModal(true);
  };

  return (
    <>
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                  <AlertTriangle className="text-amber-500" size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-800">Confirm Fee Generation</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Are you sure you want to manually trigger fee generation for all students for this month? The system will loop through all active students and create any missing fee structures.
                </p>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 bg-transparent border-0 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeTrigger}
                  className="px-5 py-2 bg-[#093C5D] hover:bg-[#0b4870] text-white rounded-lg text-sm font-bold shadow-sm transition-all border-0 cursor-pointer"
                >
                  Yes, Generate Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-[#093C5D]/5 flex items-center justify-center">
            <Activity className="text-[#093C5D]" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#093C5D]">Manual Fee Generation</h2>
            <p className="text-sm text-slate-500 mt-1">Force generate monthly fee structures for all active students.</p>
          </div>
        </div>

        {message && !isRunning && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-bold border ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : message.type === "error" ? "bg-red-50 text-red-700 border-red-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
            {message.text}
          </div>
        )}

        {/* Live Status Indicator */}
        {isRunning && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <Loader2 className="animate-spin text-amber-500 mt-0.5 shrink-0" size={20} />
            <div>
              <p className="text-sm font-black text-amber-700">Generation in Progress...</p>
              <p className="text-xs font-semibold text-amber-600/80 mt-1 leading-relaxed">
                The server is actively generating fee structures for all students in the background. You can safely leave this page. This indicator will disappear once the process is 100% complete.
              </p>
            </div>
          </div>
        )}

        {!isRunning && !message && (
           <div className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
             <Info className="text-[#093C5D] mt-0.5 shrink-0" size={20} />
             <div>
               <p className="text-sm font-black text-slate-700">System Ready</p>
               <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">
                 No background tasks are currently running. You can trigger the fee generation process now.
               </p>
             </div>
           </div>
        )}

        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-800">Generate Fees Now</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Clicking the button below will immediately trigger the background fee generation job. The system will loop through all students and generate missing fee structures for the current month. Existing fee structures will be safely skipped to avoid duplicates.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleTriggerNow}
              disabled={isTriggering || isRunning}
              className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 border-0 cursor-pointer ${
                isRunning 
                  ? "bg-amber-500 text-white cursor-not-allowed" 
                  : "bg-[#093C5D] hover:bg-[#0b4870] text-white disabled:bg-slate-300"
              }`}
            >
              {isRunning || isTriggering ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Play size={16} />
              )}
              {isRunning ? "Running in Background..." : isTriggering ? "Starting Process..." : "Generate Monthly Fees Now"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
    </>
  );
}
