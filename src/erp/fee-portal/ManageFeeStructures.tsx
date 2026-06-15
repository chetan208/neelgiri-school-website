'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Search, Loader2, Save, X, Info, Settings } from "lucide-react";
import { CLASSES, getMonthsForSession } from "./types";
import { useAuth } from "@/context/AuthContext";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

interface ManageFeeStructuresProps {
  selectedSession: string;
  onRefreshStats: () => void;
}

export default function ManageFeeStructures({ selectedSession, onRefreshStats }: ManageFeeStructuresProps) {
  const { user } = useAuth();
  const isOwner = user?.role === "Owner";

  const [targetClass, setTargetClass] = useState("All");
  const [targetMonth, setTargetMonth] = useState("");
  const [feeStructures, setFeeStructures] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Edit Modal State
  const [editingStructure, setEditingStructure] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    admissionFee: 0,
    tuitionFee: 0,
    schoolBusCharges: 0,
    examFee: 0,
    computerFee: 0,
    ptmFine: 0,
    tieBeltBooks: 0,
    buildingFund: 0,
    annualCharges: 0
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const months = getMonthsForSession(selectedSession);

  // Set default month to current month on session change
  useEffect(() => {
    if (months.length > 0) {
      const now = new Date();
      const mNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
      ];
      const curMonthStr = `${mNames[now.getMonth()]}-${now.getFullYear()}`;
      if (months.includes(curMonthStr)) {
        setTargetMonth(curMonthStr);
      } else {
        setTargetMonth(months[0]);
      }
    }
  }, [selectedSession]);

  const loadFeeStructures = async () => {
    if (!targetMonth) return;
    setLoading(true);
    try {
      const res = await axios.get(`${SERVER_URL}/api/fees/list`, {
        params: { studentClass: targetClass, month: targetMonth },
        withCredentials: true
      });
      setFeeStructures(res.data.feeStructures || []);
    } catch (err) {
      console.error("Error loading fee structures:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeeStructures();
  }, [targetClass, targetMonth, selectedSession]);

  const handleOpenEdit = (fs: any) => {
    setEditingStructure(fs);
    setEditForm({
      admissionFee: Number(fs.admissionFee) || 0,
      tuitionFee: Number(fs.tuitionFee) || 0,
      schoolBusCharges: Number(fs.schoolBusCharges) || 0,
      examFee: Number(fs.examFee) || 0,
      computerFee: Number(fs.computerFee) || 0,
      ptmFine: Number(fs.ptmFine) || 0,
      tieBeltBooks: Number(fs.tieBeltBooks) || 0,
      buildingFund: Number(fs.buildingFund) || 0,
      annualCharges: Number(fs.annualCharges) || 0
    });
    setError(null);
    setSuccess(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStructure || !isOwner) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.put(`${SERVER_URL}/api/fees/${editingStructure.id}`, editForm, { withCredentials: true });
      setSuccess("Fee structure updated successfully.");
      loadFeeStructures();
      onRefreshStats();
      setTimeout(() => {
        setEditingStructure(null);
      }, 1000);
    } catch (err: any) {
      console.error("Error updating fee structure:", err);
      setError(err.response?.data?.message || "Failed to update fee structure.");
    } finally {
      setSaving(false);
    }
  };

  const filteredList = feeStructures.filter((fs) => {
    const q = searchQuery.toLowerCase();
    return (
      fs.student.name.toLowerCase().includes(q) ||
      fs.student.cardNo.toLowerCase().includes(q) ||
      fs.studentClass.toLowerCase().includes(q)
    );
  });

  const inputCls = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D] transition-all";

  return (
    <div className="space-y-6">
      {/* Filters card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 w-full sm:w-auto flex-1">
          <label className="text-xs font-black uppercase tracking-wider text-[#093C5D] shrink-0">Class:</label>
          <select
            value={targetClass}
            onChange={(e) => setTargetClass(e.target.value)}
            className="flex-1 bg-transparent border-0 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            {CLASSES.map((cls) => (
              <option key={cls} value={cls}>
                {cls === "All" ? "All Classes" : cls}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 w-full sm:w-auto flex-1">
          <label className="text-xs font-black uppercase tracking-wider text-[#093C5D] shrink-0">Month:</label>
          <select
            value={targetMonth}
            onChange={(e) => setTargetMonth(e.target.value)}
            className="flex-1 bg-transparent border-0 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search by name, roll no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D] transition-all"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
        <div className="border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-sm font-black text-[#093C5D] uppercase tracking-wider">
            Fee Structures for {targetMonth} ({targetClass === "All" ? "All Classes" : targetClass})
          </h3>
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
            Showing rolled out structures. Only Owner can modify fee amounts.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-[#093C5D]" size={26} />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading fee structures...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-semibold italic text-xs">
            No fee structures found for this class and month. Make sure to roll out demand first.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left whitespace-nowrap text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-450">
                  <th className="py-2.5 px-4">Roll No</th>
                  <th className="py-2.5 px-4">Student Name</th>
                  <th className="py-2.5 px-4">Class</th>
                  <th className="py-2.5 px-4 text-right">Tuition</th>
                  <th className="py-2.5 px-4 text-right">Bus</th>
                  <th className="py-2.5 px-4 text-right">Exam</th>
                  <th className="py-2.5 px-4 text-right">Computer</th>
                  <th className="py-2.5 px-4 text-right">Building</th>
                  <th className="py-2.5 px-4 text-right">Annual</th>
                  <th className="py-2.5 px-4 text-right">Other/Prev</th>
                  <th className="py-2.5 px-4 text-right font-bold bg-slate-100/50">Net Total</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((fs) => {
                  const otherPrev = Number(fs.admissionFee) + Number(fs.ptmFine) + Number(fs.tieBeltBooks) + Number(fs.previousBalance);
                  return (
                    <tr key={fs.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-mono font-bold text-[#093C5D]">{fs.student.cardNo}</td>
                      <td className="py-2.5 px-4 font-black text-slate-700">{fs.student.name}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-500">{fs.studentClass}</td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-600">₹{fs.tuitionFee}</td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-600">₹{fs.schoolBusCharges}</td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-500">₹{fs.examFee}</td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-500">₹{fs.computerFee}</td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-500">₹{fs.buildingFund}</td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-500">₹{fs.annualCharges}</td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-500" title="Admission, PTM Fine, Books & Prev Balance">₹{otherPrev}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-800 bg-slate-55/30">₹{fs.totalDemand}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                          fs.status === "PAID"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : fs.status === "PARTIALLY_PAID"
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : "bg-rose-50 border-rose-200 text-rose-700"
                        }`}>
                          {fs.status === "PAID" ? "Settled" : fs.status === "PARTIALLY_PAID" ? "Partial" : "Pending"}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(fs)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-[#093C5D] text-slate-700 hover:text-white border border-slate-200 hover:border-[#093C5D] rounded-lg text-[10px] font-bold transition cursor-pointer"
                        >
                          <Edit2 size={10} /> Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingStructure && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 shrink-0">
                <div>
                  <h3 className="text-base font-black text-[#093C5D] uppercase tracking-wider">Edit Fee Structure</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    Editing: <span className="font-bold text-[#093C5D]">{editingStructure.student.name}</span> (Roll: {editingStructure.student.cardNo}) for <span className="font-bold text-[#093C5D]">{editingStructure.month}</span>
                  </p>
                </div>
                <button
                  onClick={() => setEditingStructure(null)}
                  className="text-slate-400 hover:text-[#093C5D] border-0 bg-transparent cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Tuition Fee</label>
                    <input
                      type="number"
                      min="0"
                      disabled={!isOwner}
                      value={editForm.tuitionFee}
                      onChange={(e) => setEditForm(prev => ({ ...prev, tuitionFee: Number(e.target.value) || 0 }))}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Bus Charges</label>
                    <input
                      type="number"
                      min="0"
                      disabled={!isOwner}
                      value={editForm.schoolBusCharges}
                      onChange={(e) => setEditForm(prev => ({ ...prev, schoolBusCharges: Number(e.target.value) || 0 }))}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Exam Fee</label>
                    <input
                      type="number"
                      min="0"
                      disabled={!isOwner}
                      value={editForm.examFee}
                      onChange={(e) => setEditForm(prev => ({ ...prev, examFee: Number(e.target.value) || 0 }))}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Computer Fee</label>
                    <input
                      type="number"
                      min="0"
                      disabled={!isOwner}
                      value={editForm.computerFee}
                      onChange={(e) => setEditForm(prev => ({ ...prev, computerFee: Number(e.target.value) || 0 }))}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Building Fund</label>
                    <input
                      type="number"
                      min="0"
                      disabled={!isOwner}
                      value={editForm.buildingFund}
                      onChange={(e) => setEditForm(prev => ({ ...prev, buildingFund: Number(e.target.value) || 0 }))}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Annual Charges</label>
                    <input
                      type="number"
                      min="0"
                      disabled={!isOwner}
                      value={editForm.annualCharges}
                      onChange={(e) => setEditForm(prev => ({ ...prev, annualCharges: Number(e.target.value) || 0 }))}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Tie, Belt & Books</label>
                    <input
                      type="number"
                      min="0"
                      disabled={!isOwner}
                      value={editForm.tieBeltBooks}
                      onChange={(e) => setEditForm(prev => ({ ...prev, tieBeltBooks: Number(e.target.value) || 0 }))}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Admission Fee</label>
                    <input
                      type="number"
                      min="0"
                      disabled={!isOwner}
                      value={editForm.admissionFee}
                      onChange={(e) => setEditForm(prev => ({ ...prev, admissionFee: Number(e.target.value) || 0 }))}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">PTM Fine</label>
                    <input
                      type="number"
                      min="0"
                      disabled={!isOwner}
                      value={editForm.ptmFine}
                      onChange={(e) => setEditForm(prev => ({ ...prev, ptmFine: Number(e.target.value) || 0 }))}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-[#093C5D] mb-1.5">Previous Balance (Locked)</label>
                    <input
                      type="text"
                      disabled
                      value={`₹${editingStructure.previousBalance}`}
                      className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-500 cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-[#093C5D]/4 border border-[#093C5D]/10 rounded-xl px-4 py-3 text-xs text-slate-600 font-medium flex items-start gap-2">
                  <Info size={14} className="text-[#093C5D] shrink-0 mt-0.5" />
                  <p>
                    Updating these amounts will automatically recalculate the **Net Total** and update the balance left for registered payments.
                  </p>
                </div>

                {error && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-250 text-emerald-700 text-xs font-bold rounded-xl">
                    {success}
                  </div>
                )}

                {/* Footer buttons inside body/form to stay with layout */}
                <div className="border-t border-slate-150 pt-4 flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingStructure(null)}
                    className="px-4 py-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  {isOwner && (
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2.5 bg-[#093C5D] hover:bg-[#0b4870] text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border-0 shadow-sm transition active:scale-95 flex items-center gap-1.5"
                    >
                      {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                      Save Changes
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
