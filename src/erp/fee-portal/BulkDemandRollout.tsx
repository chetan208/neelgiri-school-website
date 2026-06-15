import React from "react";
import { motion } from "framer-motion";
import { Layers, Loader2, FileCheck, Clock, Info } from "lucide-react";
import { CLASSES, getAcademicYearMonths, getMonthsForSession } from "./types";

interface BulkDemandRolloutProps {
  bulkForm: {
    month: string;
    studentClass: string;
    admissionFee: string;
    tuitionFee: string;
    examFee: string;
    ptmFine: string;
    computerFee: string;
    tieBeltBooks: string;
    buildingFund: string;
    annualCharges: string;
  };
  setBulkForm: React.Dispatch<React.SetStateAction<{
    month: string;
    studentClass: string;
    admissionFee: string;
    tuitionFee: string;
    examFee: string;
    ptmFine: string;
    computerFee: string;
    tieBeltBooks: string;
    buildingFund: string;
    annualCharges: string;
  }>>;
  onSubmit: (e: React.FormEvent) => void;
  submitLoading: boolean;
  defaultsLoading?: boolean;
  selectedSession?: string;
}

const inputCls = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D] transition-all";
const labelCls = "block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5";

export default function BulkDemandRollout({
  bulkForm,
  setBulkForm,
  onSubmit,
  submitLoading,
  defaultsLoading,
  selectedSession
}: BulkDemandRolloutProps) {
  const rolloutMonths = selectedSession ? getMonthsForSession(selectedSession) : getAcademicYearMonths();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-base font-black uppercase tracking-wider text-[#093C5D] flex items-center gap-2">
          <Layers size={18} className="text-[#093C5D]" />
          Bulk Monthly Demand Rollout
        </h3>
        {defaultsLoading && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400">
            <Loader2 size={12} className="animate-spin" /> Loading defaults...
          </span>
        )}
        {!defaultsLoading && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#093C5D] bg-[#093C5D]/5 border border-[#093C5D]/15 px-2 py-1 rounded-lg">
            Pre-filled from defaults
          </span>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Row 1: Month + Class */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Target Month *</label>
            <select
              required
              value={bulkForm.month}
              onChange={(e) => setBulkForm({ ...bulkForm, month: e.target.value })}
              className={inputCls}
            >
              <option value="" disabled>Select Target Month</option>
              {rolloutMonths.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Target Class</label>
            <select
              value={bulkForm.studentClass}
              onChange={(e) => setBulkForm({ ...bulkForm, studentClass: e.target.value })}
              className={inputCls}
            >
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Classes" : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fee Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Tuition Fee</label>
            <input type="number" placeholder="0.00" value={bulkForm.tuitionFee}
              onChange={(e) => setBulkForm({ ...bulkForm, tuitionFee: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Exam Fee</label>
            <input type="number" placeholder="0.00" value={bulkForm.examFee}
              onChange={(e) => setBulkForm({ ...bulkForm, examFee: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Computer Fee</label>
            <input type="number" placeholder="0.00" value={bulkForm.computerFee}
              onChange={(e) => setBulkForm({ ...bulkForm, computerFee: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>PTM Fine</label>
            <input type="number" placeholder="0.00" value={bulkForm.ptmFine}
              onChange={(e) => setBulkForm({ ...bulkForm, ptmFine: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Building Fund</label>
            <input type="number" placeholder="0.00" value={bulkForm.buildingFund}
              onChange={(e) => setBulkForm({ ...bulkForm, buildingFund: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Annual Charges</label>
            <input type="number" placeholder="0.00" value={bulkForm.annualCharges}
              onChange={(e) => setBulkForm({ ...bulkForm, annualCharges: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Tie, Belt and Books</label>
            <input type="number" placeholder="0.00" value={bulkForm.tieBeltBooks}
              onChange={(e) => setBulkForm({ ...bulkForm, tieBeltBooks: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Admission Fee (Voluntary)</label>
            <input type="number" placeholder="0.00" value={bulkForm.admissionFee}
              onChange={(e) => setBulkForm({ ...bulkForm, admissionFee: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>

        {/* Bus charges info note */}
        <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Bus charges are not entered here. They are applied automatically per student based on their assigned station rate set in the Transport module. Students with no station assigned receive zero bus charges.
          </p>
        </div>

        {/* Carry-forward note */}
        <div className="bg-[#093C5D]/4 border border-[#093C5D]/10 rounded-xl px-4 py-3 flex items-start gap-2.5">
          <Clock size={14} className="text-[#093C5D] shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            <strong>Carry-forward:</strong> Any unpaid balance from the previous month is automatically inherited into <strong>Previous Balance</strong> for each student.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitLoading}
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#093C5D] hover:bg-[#0b4870] text-white rounded-2xl text-sm font-black uppercase tracking-widest transition duration-200 cursor-pointer border-0 shadow-sm active:scale-95"
        >
          {submitLoading ? <Loader2 size={16} className="animate-spin" /> : <FileCheck size={16} />}
          {submitLoading ? "Rolling out..." : "Rollout Monthly Demand Ledger"}
        </button>
      </form>
    </motion.div>
  );
}
