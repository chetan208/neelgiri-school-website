'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, DollarSign, Printer, ChevronDown, ChevronUp, Receipt } from "lucide-react";
import { FeeStructureType } from "./types";

interface FeeMatrixTableProps {
  feeStructures: FeeStructureType[];
  feesLoading: boolean;
  onPay: (fee: FeeStructureType) => void;
  onPrint: (fee: FeeStructureType) => void;
  getStatusStyle: (status: string) => string;
  getStatusTextLabel: (status: string) => string;
}

const MONTH_ORDER = ["April","May","June","July","August","September","October","November","December","January","February","March"];

const FEE_HEADS = [
  { key: "admissionFee",        label: "Admission" },
  { key: "tuitionFee",          label: "Tuition" },
  { key: "schoolBusCharges",    label: "Bus" },
  { key: "examFee",             label: "Exam" },
  { key: "computerFee",         label: "Computer" },
  { key: "ptmFine",             label: "PTM Fine" },
  { key: "tieBeltBooks",        label: "Tie/Belt/Books" },
  { key: "buildingFund",        label: "Building Fund" },
  { key: "annualCharges",       label: "Annual" },
  { key: "previousSessionDues", label: "Prev Dues" },
] as const;

function sortFees(fees: FeeStructureType[]) {
  return [...fees].sort((a, b) => {
    const [aM, aY] = a.month.split("-");
    const [bM, bY] = b.month.split("-");
    if (!aM || !bM) return 0;
    const yDiff = parseInt(aY) - parseInt(bY);
    return yDiff !== 0 ? yDiff : MONTH_ORDER.indexOf(aM) - MONTH_ORDER.indexOf(bM);
  });
}

function fmt(v: number | string) {
  const n = Number(v) || 0;
  if (n === 0) return "—";
  return n > 0 ? `₹${n.toLocaleString("en-IN")}` : `-₹${Math.abs(n).toLocaleString("en-IN")}`;
}

function StatusBadge({ status }: { status: string }) {
  const base = "inline-flex items-center text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border";
  if (status === "PAID")
    return <span className={`${base} bg-[#093C5D]/8 border-[#093C5D]/20 text-[#093C5D]`}>Settled</span>;
  if (status === "PARTIALLY_PAID")
    return <span className={`${base} bg-amber-50 border-amber-200 text-amber-700`}>Partial</span>;
  return <span className={`${base} bg-rose-50 border-rose-200 text-rose-700`}>Pending</span>;
}

export default function FeeMatrixTable({
  feeStructures, feesLoading, onPay, onPrint,
}: FeeMatrixTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const sorted = sortFees(feeStructures);
  const latestId = sorted[sorted.length - 1]?.id;

  const totalDemand  = sorted.reduce((s, f) => s + Number(f.total || f.totalDemand || 0), 0);
  const totalPaid    = sorted.reduce((s, f) => s + (f.payments?.reduce((ps, p) => ps + (Number(p.amountPaid) || 0), 0) ?? 0), 0);
  const totalBalance = Math.round((totalDemand - totalPaid) * 100) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full"
    >
      {/* ── Header bar ── */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <Receipt size={15} className="text-[#093C5D]" />
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#093C5D]">Academic Fee Ledger</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Oldest to newest — current month at bottom</p>
          </div>
        </div>

        {/* Totals */}
        {sorted.length > 0 && (
          <div className="flex items-center gap-2 text-[10px] font-black">
            <span className="bg-[#093C5D]/8 border border-[#093C5D]/15 text-[#093C5D] px-3 py-1.5 rounded-lg">
              Total: <span className="font-mono">₹{totalDemand.toLocaleString("en-IN")}</span>
            </span>
            <span className="bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg">
              Paid: <span className="font-mono">₹{totalPaid.toLocaleString("en-IN")}</span>
            </span>
            {totalBalance > 0 && (
              <span className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1.5 rounded-lg">
                Due: <span className="font-mono">₹{totalBalance.toLocaleString("en-IN")}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="w-full overflow-x-auto">
        {feesLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-[#093C5D]" size={26} />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Fee Ledger…</span>
          </div>
        ) : sorted.length > 0 ? (
          <table className="w-full border-collapse text-left whitespace-nowrap">

            {/* Column headers */}
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="sticky left-0 bg-slate-50 z-10 px-5 py-3.5 border-r border-slate-100 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.07)]">Month</th>
                <th className="px-5 py-3.5 text-left">Breakdown</th>
                <th className="px-5 py-3.5 text-right">Arrears</th>
                <th className="px-5 py-3.5 text-right">Net Total</th>
                <th className="px-5 py-3.5 text-right">Paid</th>
                <th className="px-5 py-3.5 text-right">Balance</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {sorted.map((fee, i) => {
                const amountPaid  = fee.payments?.reduce((s, p) => s + (Number(p.amountPaid) || 0), 0) ?? 0;
                const balance     = Math.round((Number(fee.total || fee.totalDemand || 0) - amountPaid) * 100) / 100;
                const itemized    = FEE_HEADS.reduce((s, h) => s + (Number((fee as any)[h.key]) || 0), 0);
                const isLatest    = fee.id === latestId;
                const isExpanded  = expandedRow === fee.id;
                const isEven      = i % 2 === 0;

                return (
                  <React.Fragment key={fee.id}>
                    {/* ── Main data row ── */}
                    <tr
                      className={`border-b border-slate-100 transition-colors group
                        ${isLatest ? "bg-[#093C5D]/[0.03]" : isEven ? "bg-white" : "bg-slate-50/40"}
                        hover:bg-[#093C5D]/[0.04]
                      `}
                    >
                      {/* Month */}
                      <td className={`sticky left-0 z-10 px-5 py-4 border-r border-slate-100 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.07)]
                        ${isLatest ? "bg-[#093C5D]/[0.03]" : isEven ? "bg-white" : "bg-slate-50/40"}
                        group-hover:bg-[#093C5D]/[0.04]`}
                      >
                        <p className="text-sm font-black text-slate-800 leading-tight">{fee.month.split("-")[0]}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{fee.month.split("-")[1]}</p>
                        {isLatest && (
                          <span className="inline-block mt-1 text-[8px] font-black uppercase tracking-widest text-white bg-[#093C5D] px-1.5 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </td>

                      {/* Breakdown toggle */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setExpandedRow(isExpanded ? null : fee.id)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-wider hover:border-[#093C5D]/30 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <span className="font-mono text-[11px] text-slate-800">₹{itemized.toLocaleString("en-IN")}</span>
                          {isExpanded ? <ChevronUp size={10} className="text-slate-500" /> : <ChevronDown size={10} className="text-slate-500" />}
                        </button>
                      </td>

                      {/* Arrears */}
                      <td className="px-5 py-4 text-right">
                        <span className="font-mono text-[11px] font-bold text-slate-500">{fmt(fee.previousBalance)}</span>
                      </td>

                      {/* Net Demand */}
                      <td className="px-5 py-4 text-right">
                        <span className="inline-block font-mono text-[11px] font-black text-white bg-[#093C5D] px-3 py-1.5 rounded-lg">
                          {fmt(fee.total || fee.totalDemand || 0)}
                        </span>
                      </td>

                      {/* Paid */}
                      <td className="px-5 py-4 text-right">
                        <span className="font-mono text-[11px] font-bold text-slate-700">{fmt(amountPaid)}</span>
                      </td>

                      {/* Balance */}
                      <td className="px-5 py-4 text-right">
                        <span className={`font-mono text-[11px] font-bold ${balance < 0 ? "text-emerald-600" : balance > 0 ? "text-rose-600" : "text-slate-400"}`}>
                          {fmt(balance)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        <StatusBadge status={fee.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          {isLatest && totalBalance > 0 && (
                            <button
                              onClick={() => onPay(fee)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#093C5D] hover:bg-[#0b4870] text-white rounded-lg text-[10px] font-black uppercase tracking-wider border-0 cursor-pointer transition active:scale-95"
                            >
                              <DollarSign size={11} /> Pay
                            </button>
                          )}
                          <button
                            onClick={() => onPrint(fee)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-slate-200 cursor-pointer transition active:scale-95"
                          >
                            <Printer size={11} /> Receipt
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* ── Expanded breakdown sub-row ── */}
                    {isExpanded && (
                      <tr className="border-b border-slate-100 bg-slate-50/80">
                        <td colSpan={8} className="px-5 py-3">
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.18 }}
                            >
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Fee Head Breakdown</p>
                              <div className="flex flex-wrap gap-2">
                                {FEE_HEADS.map(({ key, label }) => {
                                  const val = Number((fee as any)[key]);
                                  if (val <= 0) return null;
                                  return (
                                    <div key={key} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                                      <span className="text-[10px] text-slate-500 font-semibold">{label}</span>
                                      <span className="font-mono text-[10px] font-black text-slate-800">₹{val.toLocaleString("en-IN")}</span>
                                    </div>
                                  );
                                })}
                                {FEE_HEADS.every(({ key }) => Number((fee as any)[key]) === 0) && (
                                  <p className="text-[10px] text-slate-400 italic">No itemized heads for this month.</p>
                                )}
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>

            {/* ── Totals footer row ── */}
            <tfoot>
              <tr className="bg-slate-50 border-t-2 border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-600">
                <td className="sticky left-0 bg-slate-50 z-10 px-5 py-3.5 border-r border-slate-100 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.07)]" colSpan={2}>
                  Totals ({sorted.length} month{sorted.length !== 1 ? "s" : ""})
                </td>
                <td className="px-5 py-3.5 text-right">—</td>
                <td className="px-5 py-3.5 text-right">
                  <span className="font-mono text-[11px] font-black text-white bg-[#093C5D] px-3 py-1.5 rounded-lg">
                    ₹{totalDemand.toLocaleString("en-IN")}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-[11px] text-slate-700">₹{totalPaid.toLocaleString("en-IN")}</td>
                <td className={`px-5 py-3.5 text-right font-mono text-[11px] ${totalBalance > 0 ? "text-rose-600" : "text-slate-400"}`}>
                  {totalBalance > 0 ? `₹${totalBalance.toLocaleString("en-IN")}` : "—"}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>

          </table>
        ) : (
          <div className="py-16 text-center text-slate-400 italic text-sm">
            No monthly ledger entries found.
          </div>
        )}
      </div>
    </motion.div>
  );
}
