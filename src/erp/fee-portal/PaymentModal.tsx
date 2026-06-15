import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Loader2, CheckCircle2 } from "lucide-react";
import { FeeStructureType } from "./types";

interface PaymentModalProps {
  showPaymentModal: boolean;
  setShowPaymentModal: (show: boolean) => void;
  selectedFee: FeeStructureType | null;
  paymentForm: {
    amountPaid: string;
    paymentMode: "CASH" | "UPI";
    date: string;
  };
  setPaymentForm: React.Dispatch<React.SetStateAction<{
    amountPaid: string;
    paymentMode: "CASH" | "UPI";
    date: string;
  }>>;
  paymentLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PaymentModal({
  showPaymentModal,
  setShowPaymentModal,
  selectedFee,
  paymentForm,
  setPaymentForm,
  paymentLoading,
  onSubmit
}: PaymentModalProps) {
  return (
    <AnimatePresence>
      {showPaymentModal && selectedFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={() => setShowPaymentModal(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden relative z-10"
          >
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#093C5D] flex items-center gap-1.5">
                <DollarSign size={16} /> Collect Fee Payment
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600 border-0 bg-transparent cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-5">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Billing Month</label>
                <p className="text-sm font-black text-[#093C5D] mt-0.5">{selectedFee.month}</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Amount Paid (Rs.) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="0.00"
                  value={paymentForm.amountPaid}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Payment Mode *</label>
                <select
                  value={paymentForm.paymentMode}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value as "CASH" | "UPI" })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                >
                  <option value="UPI">UPI Payment</option>
                  <option value="CASH">CASH Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Payment Date (Optional)</label>
                <input
                  type="date"
                  value={paymentForm.date}
                  onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3.5 bg-[#14B8A6] hover:bg-[#0f8b7d] text-white rounded-2xl text-xs font-black uppercase tracking-wider transition border-0 cursor-pointer shadow-lg shadow-[#14B8A6]/10 active:scale-95 disabled:opacity-50"
                >
                  {paymentLoading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                  {paymentLoading ? "Saving Transaction..." : "Save Payment Details"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
