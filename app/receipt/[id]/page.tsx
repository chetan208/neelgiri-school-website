'use client';

import React, { useState, useEffect, use } from "react";
import { Loader2, Printer, AlertTriangle, ArrowLeft } from "lucide-react";
import axios from "axios";
import Link from "next/link";

const fmt = (v: string | number) => Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

interface ReceiptPageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default function ReceiptPage({ params }: ReceiptPageProps) {
  // Safe resolution of params for compatibility with Next.js 13/14/15
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const id = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

  useEffect(() => {
    if (!id) return;
    const fetchReceipt = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/erp/receipt/public/${id}`);
        if (res.data.success) {
          setData(res.data);
          console.log(res.data);
        } else {
          setError(res.data.message || "Failed to load receipt");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch receipt from server.");
      } finally {
        setLoading(false);
      }
    };
    fetchReceipt();
  }, [id, SERVER_URL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-500 font-bold text-xs">
        <Loader2 className="animate-spin text-[#093C5D] mb-3" size={32} />
        <p>Loading digital receipt...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 bg-rose-50 border border-rose-200 rounded-full flex items-center justify-center mx-auto text-rose-600">
          <AlertTriangle size={28} />
        </div>
        <h2 className="text-base font-black text-[#093C5D]">Receipt Access Failed</h2>
        <p className="text-xs text-slate-400 font-semibold">{error || "This receipt record could not be found or has been removed."}</p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#093C5D] text-white rounded-xl text-xs font-bold transition hover:bg-[#001F42]"
        >
          <ArrowLeft size={14} /> Back to Homepage
        </Link>
      </div>
    );
  }

  const { student, fee: rawFee, allFees: rawAllFees } = data;
  
  // Recalculate remaining to ignore DB's potentially stale remaining field
  const allFees = rawAllFees.map((f: any) => {
    const total = parseFloat(f.total || f.totalDemand || "0");
    const paid = f.payments?.reduce((sum: number, p: any) => sum + (parseFloat(p.amountPaid) || 0), 0) || 0;
    return { ...f, remaining: String(Math.round((total - paid) * 100) / 100) };
  });
  
  const fee = allFees.find((f: any) => f.id === rawFee.id) || {
    ...rawFee,
    remaining: String(Math.round((parseFloat(rawFee.total || rawFee.totalDemand || "0") - (rawFee.payments?.reduce((sum: number, p: any) => sum + (parseFloat(p.amountPaid) || 0), 0) || 0)) * 100) / 100)
  };
  const today = new Date(fee.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const invoiceNo = `NPS-${student.cardNo}-${fee.month.replace("-", "")}`;

  // 1. Gather all payments across all months to find the latest transaction
  const allPayments: any[] = [];
  for (const f of allFees) {
    if (f.payments) {
      allPayments.push(...f.payments.map((p: any) => ({ ...p, month: f.month })));
    }
  }

  // Sort payments by date (newest first) to identify the latest transaction
  allPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let transactionAmountPaid = 0;
  let latestTransactionPayments: any[] = [];

  if (allPayments.length > 0) {
    const latestDate = new Date(allPayments[0].date).getTime();
    // Group payments within 5 seconds of the latest payment (created in the same transaction)
    latestTransactionPayments = allPayments.filter(p => {
      return Math.abs(new Date(p.date).getTime() - latestDate) < 5000;
    });
    transactionAmountPaid = Math.round(latestTransactionPayments.reduce((sum, p) => sum + (parseFloat(p.amountPaid) || 0), 0) * 100) / 100;
  }

  // Calculate Arrears (Previous months' balance BEFORE latest transaction)
  const parseMonthStr = (str: string) => {
    const [mName, year] = str.split("-");
    return new Date(`${mName} 1, ${year}`);
  };

  const sortedAllFees = [...allFees].sort((a, b) => {
    return parseMonthStr(a.month).getTime() - parseMonthStr(b.month).getTime();
  });

  const currentMonthDate = parseMonthStr(fee.month);

  let activePreviousBalance = 0; // Previous months' arrears BEFORE latest transaction
  for (const f of sortedAllFees) {
    if (parseMonthStr(f.month) < currentMonthDate) {
      // Find if there was a payment for this month in the latest transaction
      const paymentInThisTx = latestTransactionPayments
        .filter(p => p.feeStructureId === f.id)
        .reduce((sum, p) => sum + (parseFloat(p.amountPaid) || 0), 0);
      
      const prevSessionDues = parseFloat(f.previousSessionDues || "0") || 0;
      const fRemainingBefore = Math.round((parseFloat(f.remaining || "0") + paymentInThisTx - prevSessionDues) * 100) / 100;
      activePreviousBalance = Math.round((activePreviousBalance + prevSessionDues + fRemainingBefore) * 100) / 100;
    }
  }

  // Also fold current month's previousSessionDues into activePreviousBalance
  const currentPrevSessionDues = parseFloat(fee.previousSessionDues || "0") || 0;
  activePreviousBalance = Math.round((activePreviousBalance + currentPrevSessionDues) * 100) / 100;

  // Current month outstanding BEFORE latest transaction (excluding previousSessionDues)
  const currentMonthPaymentInThisTx = latestTransactionPayments
    .filter(p => p.feeStructureId === fee.id)
    .reduce((sum, p) => sum + (parseFloat(p.amountPaid) || 0), 0);

  const currentMonthOutstandingBefore = Math.round((parseFloat(fee.remaining || "0") + currentMonthPaymentInThisTx - currentPrevSessionDues) * 100) / 100;

  const totalAmountDueBefore = Math.round((currentMonthOutstandingBefore + activePreviousBalance) * 100) / 100;
  
  // Total overall remaining balance AFTER this transaction across ALL months
  const remainingBalanceAfter = Math.round(sortedAllFees.reduce((sum, f) => sum + parseFloat(f.remaining || "0"), 0) * 100) / 100;

  const activeTotal = parseFloat(fee.total || fee.totalDemand || "0") - currentPrevSessionDues;
  const grossTotal = Math.round((activeTotal + activePreviousBalance) * 100) / 100;

  // Calculate running balances for all history fees
  let runningDues = 0;
  const historyWithBalances = sortedAllFees.map((h: any) => {
    const prevSessionDues = parseFloat(h.previousSessionDues || "0") || 0;
    const total = parseFloat(h.total || h.totalDemand || "0") - prevSessionDues;
    const paid = h.payments?.reduce((s: number, p: any) => s + (parseFloat(p.amountPaid) || 0), 0) ?? 0;
    const currentRemaining = Math.round((total - paid) * 100) / 100;
    const prevRemaining = runningDues + prevSessionDues;
    runningDues = Math.round((runningDues + prevSessionDues + currentRemaining) * 100) / 100;
    
    return {
      ...h,
      paid,
      total,
      currentRemaining,
      prevRemaining,
      totalBalance: runningDues
    };
  });

  // Filter history to 4 most-recent months to keep it concise on A4 size
  const history = historyWithBalances.slice(-4);

  // Breakdown heads
  const feeHeads = [
    { label: "Admission Fee", val: fee.admissionFee },
    { label: "Tuition Fee", val: fee.tuitionFee },
    { label: "Exam Fee", val: fee.examFee },
    { label: "School Bus Charges", val: fee.schoolBusCharges },
    { label: "PTM Fine", val: fee.ptmFine },
    { label: "Computer Fee", val: fee.computerFee },
    { label: "Tie, Belt & Books", val: fee.tieBeltBooks },
    { label: "Building Fund", val: fee.buildingFund },
    { label: "Annual Charges", val: fee.annualCharges },
    { label: "Previous Balance", val: activePreviousBalance },
  ].filter(h => Number(h.val) > 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6">
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          @page {
            size: A4;
            margin: 6mm 8mm !important;
          }
          body { 
            visibility: hidden !important; 
            padding: 0 !important; 
            margin: 0 !important; 
            background: white !important; 
          }
          .receipt-container, .receipt-container * { 
            visibility: visible !important; 
          }
          .receipt-container { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important; 
            max-width: 100% !important; 
            border: none !important; 
            box-shadow: none !important; 
            padding: 0 !important; 
            margin: 0 !important; 
            background: transparent !important; 
            font-size: 9px !important;
          }
          /* Print-specific compact layout overrides */
          .logo { width: 42px !important; height: 42px !important; }
          h1 { font-size: 13px !important; }
          h2 { font-size: 15px !important; }
          .hdr-section { padding-bottom: 6px !important; margin-bottom: 6px !important; border-bottom-width: 2px !important; }
          .info-grid { gap: 6px !important; margin-bottom: 6px !important; display: grid !important; grid-template-columns: 1fr 1fr !important; }
          .info-box { padding: 5px 8px !important; border-radius: 8px !important; }
          .info-title { margin-bottom: 3px !important; padding-bottom: 2px !important; font-size: 8px !important; }
          .info-row { margin-bottom: 2px !important; }
          .sec { margin-top: 6px !important; margin-bottom: 3px !important; font-size: 8.5px !important; padding-bottom: 1px !important; }
          table { margin-bottom: 4px !important; }
          th, td { padding: 3px 5px !important; font-size: 8.5px !important; }
          .footer-section { margin-top: 6px !important; padding-top: 4px !important; }
          .terms { font-size: 7px !important; max-width: 320px !important; line-height: 1.3 !important; }
          .sig { width: 120px !important; }
          .sig-line { margin-bottom: 2px !important; }
        }
      `}} />

      {/* Control Bar (Hidden on print) */}
      <div className="max-w-3xl mx-auto no-print mb-6 flex justify-between items-center bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <Link 
          href="/" 
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#093C5D] transition"
        >
          <ArrowLeft size={14} />
          <span>Home</span>
        </Link>
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-[#093C5D] hover:bg-[#001F42] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 border-0 cursor-pointer active:scale-95"
        >
          <Printer size={14} />
          Print Receipt
        </button>
      </div>

      {/* Invoice Card Container */}
      <div className="receipt-container max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm text-slate-800 font-sans text-xs">
        
        {/* Header Section */}
        <div className="hdr-section flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-3 border-[#093C5D] pb-5 mb-5 gap-4">
          <div className="flex items-center gap-3">
            <img src="/school_logo.png" className="logo w-14 h-14 object-contain border border-slate-200 rounded-full" alt="Neelgiri Public School Logo" />
            <div>
              <h1 className="text-base font-black text-[#093C5D] uppercase tracking-wide">Neelgiri Public School</h1>
              <p className="text-[9px] text-slate-500 font-semibold uppercase mt-0.5">Hatwas, Nagrota Bagwan, Himachal Pradesh – 176047</p>
              <p className="text-[9px] text-slate-400 mt-0.5">info@neelgiripublicschool.in &nbsp;|&nbsp; +91 98160 73096 &nbsp;|&nbsp; www.neelgiripublicschool.in</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <h2 className="text-xl font-black text-[#14B8A6] uppercase tracking-wider">Fee Receipt</h2>
            <div className="text-[9.5px] text-slate-600 mt-2 space-y-0.5">
              <p>Receipt No: <strong>{invoiceNo}</strong></p>
              <p>Date: <strong>{today}</strong></p>
              <p>Billing Period: <strong>{fee.month}</strong></p>
            </div>
          </div>
        </div>

        {/* Student + Receipt Summary Grid */}
        <div className="info-grid grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="info-box bg-slate-50 border border-slate-250/50 rounded-xl p-4 space-y-1.5">
            <h3 className="info-title text-[9px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5 mb-2">Student Details</h3>
            <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="font-bold text-slate-800">{student.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Class</span><span className="font-bold text-slate-800">{student.studentclass?.className || fee.studentClass}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Card No.</span><span className="font-bold text-[#093C5D] font-mono">{student.cardNo}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Father's Name</span><span className="font-bold text-slate-800">{student.fatherName || "N/A"}</span></div>
          </div>
          <div className="info-box bg-slate-50 border border-slate-250/50 rounded-xl p-4 space-y-1.5">
            <h3 className="info-title text-[9px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5 mb-2">Receipt Summary</h3>
            <div className="flex justify-between"><span className="text-slate-500">Contact</span><span className="font-bold text-slate-800">{student.contactNo || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Current Month Fee</span><span className="font-bold text-slate-800">Rs. {fmt(activeTotal)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Previous Arrears</span><span className="font-bold text-slate-800">Rs. {fmt(activePreviousBalance)}</span></div>
            <div className="flex justify-between border-t border-slate-200 pt-1.5 mt-1">
              <span className="text-slate-500 font-bold">Total Amount Due</span>
              <span className="font-black text-[#093C5D]">Rs. {fmt(totalAmountDueBefore)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-700 font-bold">Amount Paid (Tx)</span>
              <span className="font-black text-emerald-600">Rs. {fmt(transactionAmountPaid)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/50 pt-1.5">
              <span className="text-slate-500 font-bold">Remaining Balance</span>
              <span className="font-black text-rose-600">Rs. {fmt(remainingBalanceAfter)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status</span>
              <span className="font-black" style={{ color: fee.status === "PAID" ? "#15803d" : "#b91c1c" }}>
                {fee.status.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Current Period Breakdown Table */}
        <div className="space-y-2 mb-6">
          <h3 className="sec text-[9.5px] font-black uppercase tracking-wider text-[#093C5D] border-b-2 border-[#093C5D] pb-1">
            Current Period Breakdown — {fee.month}
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#093C5D] text-white">
                <th className="p-2 text-left font-bold text-[9px] uppercase">Fee Head</th>
                <th className="p-2 text-right font-bold text-[9px] uppercase">Amount</th>
              </tr>
            </thead>
            <tbody>
              {feeHeads.map(head => (
                <tr key={head.label} className="border-b border-slate-200">
                  <td className="p-2 text-slate-700 font-medium">{head.label}</td>
                  <td className="p-2 text-right text-slate-900 font-bold">Rs. {fmt(head.val)}</td>
                </tr>
              ))}
              <tr className="bg-slate-100 font-black border-t-2 border-[#093C5D]">
                <td className="p-2 text-slate-800">Total Amount Due</td>
                <td className="p-2 text-right text-[#093C5D] text-xs">Rs. {fmt(grossTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Statement Table */}
        <div className="space-y-2 mb-6">
          <h3 className="sec text-[9.5px] font-black uppercase tracking-wider text-[#093C5D] border-b-2 border-[#093C5D] pb-1">
            Academic Year Statement (Last {history.length} Months)
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#093C5D] text-white">
                <th className="p-2 text-left font-bold text-[9px] uppercase">Month</th>
                <th className="p-2 text-right font-bold text-[9px] uppercase">Total</th>
                <th className="p-2 text-right font-bold text-[9px] uppercase">Paid</th>
                <th className="p-2 text-right font-bold text-[9px] uppercase">Prev Bal</th>
                <th className="p-2 text-right font-bold text-[9px] uppercase">Remaining</th>
                <th className="p-2 text-right font-bold text-[9px] uppercase">Total Bal</th>
                <th className="p-2 text-center font-bold text-[9px] uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map(h => {
                const bg = h.status === "PAID" ? "#dcfce7" : h.status === "PARTIALLY_PAID" ? "#fef3c7" : "#fee2e2";
                const fg = h.status === "PAID" ? "#15803d" : h.status === "PARTIALLY_PAID" ? "#b45309" : "#b91c1c";
                const label = h.status === "PAID" ? "Settled" : h.status === "PARTIALLY_PAID" ? "Partial" : "Pending";
                return (
                  <tr key={h.id} className="border-b border-slate-200 text-[10.5px]">
                    <td className="p-2 text-slate-700 font-medium">{h.month}</td>
                    <td className="p-2 text-right text-slate-900">Rs. {fmt(h.total)}</td>
                    <td className="p-2 text-right text-slate-900">Rs. {fmt(h.paid)}</td>
                    <td className="p-2 text-right text-slate-900">Rs. {fmt(h.prevRemaining)}</td>
                    <td className="p-2 text-right font-bold" style={{ color: h.currentRemaining > 0 ? "#b91c1c" : "#15803d" }}>Rs. {fmt(h.currentRemaining)}</td>
                    <td className="p-2 text-right font-black" style={{ color: h.totalBalance > 0 ? "#b91c1c" : "#15803d" }}>Rs. {fmt(h.totalBalance)}</td>
                    <td className="p-2 text-center">
                      <span style={{ backgroundColor: bg, color: fg, padding: "2px 8px", borderRadius: "4px", fontSize: "9px", fontWeight: "800" }}>
                        {label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-slate-100 font-black border-t-2 border-[#093C5D]">
                <td colSpan={5} className="p-2 text-right text-slate-800">Total Overall Remaining Balance</td>
                <td className="p-2 text-right text-rose-600 text-[11px]">Rs. {fmt(remainingBalanceAfter)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Section */}
        <div className="footer-section flex justify-between items-end border-t border-dashed border-slate-300 pt-4 mt-6">
          <div className="terms text-[9px] text-slate-500 max-w-sm leading-relaxed">
            <strong>Terms & Conditions:</strong><br />
            1. This is an official receipt of Neelgiri Public School, Lower Hatwas.<br />
            2. Unpaid balances carry forward automatically to the next billing month.<br />
            3. For disputes, contact the accounts office within 7 days of receipt.
          </div>
          <div className="sig text-center w-36">
            <div className="sig-line border-t border-dashed border-slate-400 mb-1.5"></div>
            <p className="font-bold text-slate-800">Accounts Officer</p>
            <p className="text-[8px] text-slate-400 mt-0.5">Neelgiri Public School</p>
          </div>
        </div>

      </div>
    </div>
  );
}
