'use client';

import React, { useState } from "react";
import axios from "axios";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

interface StudentRegistrationFormProps {
  selectedSession: string;
  classes: any[];
  stations: any[];
  onSuccess: (studentName: string) => void;
  onCancel?: () => void;
}

export default function StudentRegistrationForm({
  selectedSession,
  classes,
  stations,
  onSuccess,
  onCancel
}: StudentRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    studentClass: "",
    fatherName: "",
    motherName: "",
    dateOfAdmission: "",
    dob: "",
    cardNo: "",
    contactNo: "",
    station: "",
    initialAmountPaid: "",
    paymentMode: "CASH",
    previousSessionDues: "",
    discountTuition: "",
    discountBus: "",
    discountAdmission: "",
    discountAnnual: "",
    discountExam: "",
    discountComputer: ""
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      name: "",
      studentClass: "",
      fatherName: "",
      motherName: "",
      dateOfAdmission: "",
      dob: "",
      cardNo: "",
      contactNo: "",
      station: "",
      initialAmountPaid: "",
      paymentMode: "CASH",
      previousSessionDues: "",
      discountTuition: "",
      discountBus: "",
      discountAdmission: "",
      discountAnnual: "",
      discountExam: "",
      discountComputer: ""
    });
  };

  const handleClassChange = async (className: string) => {
    setFormData(prev => ({ ...prev, studentClass: className }));
    if (!className) return;

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
    try {
      const res = await axios.get(`${SERVER_URL}/api/erp/students/next-roll-no`, {
        params: { className, sessionYear: selectedSession },
        withCredentials: true
      });
      if (res.data.success && res.data.nextRollNo) {
        setFormData(prev => ({ ...prev, cardNo: res.data.nextRollNo }));
      }
    } catch (err) {
      console.error("Error fetching next roll number:", err);
    }
  };

  React.useEffect(() => {
    if (formData.studentClass) {
      const fetchNextRoll = async () => {
        const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
        try {
          const res = await axios.get(`${SERVER_URL}/api/erp/students/next-roll-no`, {
            params: { className: formData.studentClass, sessionYear: selectedSession },
            withCredentials: true
          });
          if (res.data.success && res.data.nextRollNo) {
            setFormData(prev => ({ ...prev, cardNo: res.data.nextRollNo }));
          }
        } catch (err) {
          console.error("Error fetching next roll number:", err);
        }
      };
      fetchNextRoll();
    }
  }, [selectedSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setSuccess(null);

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

    try {
      const payload = {
        name: formData.name,
        className: formData.studentClass,
        admissionDate: formData.dateOfAdmission,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        dob: formData.dob || null,
        cardNo: formData.cardNo,
        contactNo: formData.contactNo,
        station: formData.station,
        sessionYear: selectedSession,
        initialAmountPaid: formData.initialAmountPaid ? parseFloat(formData.initialAmountPaid) : 0,
        paymentMode: formData.paymentMode,
        previousSessionDues: formData.previousSessionDues ? parseFloat(formData.previousSessionDues) : 0,
        discountTuition: formData.discountTuition ? parseFloat(formData.discountTuition) : 0,
        discountBus: formData.discountBus ? parseFloat(formData.discountBus) : 0,
        discountAdmission: formData.discountAdmission ? parseFloat(formData.discountAdmission) : 0,
        discountAnnual: formData.discountAnnual ? parseFloat(formData.discountAnnual) : 0,
        discountExam: formData.discountExam ? parseFloat(formData.discountExam) : 0,
        discountComputer: formData.discountComputer ? parseFloat(formData.discountComputer) : 0
      };

      const res = await axios.post(`${SERVER_URL}/api/erp/student`, payload, { withCredentials: true });
      if (res.data.success) {
        setSuccess(`${formData.name} registered successfully!`);
        resetForm();
        onSuccess(payload.name);
      }
    } catch (err: any) {
      console.error("Error in registering student:", err);
      setError(err.response?.data?.message || "Failed to register student. Check if card number is unique.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 font-bold">
          <CheckCircle2 size={15} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 font-bold">
          <AlertTriangle size={15} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Full Name</label>
          <input
            type="text"
            required
            placeholder="Student's Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D] bg-slate-50/50"
          />
        </div>

        {/* Student Class */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Student Class</label>
          <select
            required
            value={formData.studentClass}
            onChange={(e) => handleClassChange(e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none cursor-pointer bg-white"
          >
            <option value="" disabled>-- Select Class --</option>
            {classes.map(c => (
              <option key={c.id} value={c.className}>{c.className}</option>
            ))}
          </select>
        </div>

        {/* Father's Name */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Father's Name</label>
          <input
            type="text"
            required
            placeholder="Father's Full Name"
            value={formData.fatherName}
            onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
            className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D] bg-slate-50/50"
          />
        </div>

        {/* Mother's Name */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Mother's Name</label>
          <input
            type="text"
            required
            placeholder="Mother's Full Name"
            value={formData.motherName}
            onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
            className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D] bg-slate-50/50"
          />
        </div>

        {/* Admission Date */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Admission Date</label>
          <input
            type="date"
            required
            value={formData.dateOfAdmission}
            onChange={(e) => setFormData({ ...formData, dateOfAdmission: e.target.value })}
            className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D] bg-slate-50/50"
          />
        </div>

        {/* Date of Birth */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Date of Birth</label>
          <input
            type="date"
            required
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D] bg-slate-50/50"
          />
        </div>

        {/* Card No / Roll No */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Card No. (Roll No)</label>
          <input
            type="text"
            required
            placeholder="e.g. 101"
            value={formData.cardNo}
            onChange={(e) => setFormData({ ...formData, cardNo: e.target.value })}
            className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D] bg-slate-50/50"
          />
        </div>

        {/* Contact Number */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Contact Number</label>
          <input
            type="tel"
            required
            placeholder="10-digit mobile"
            value={formData.contactNo}
            onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
            className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D] bg-slate-50/50"
          />
        </div>

        {/* Transit / Transport Station */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Transit / Transport Station</label>
          <select
            value={formData.station}
            onChange={(e) => setFormData({ ...formData, station: e.target.value })}
            className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none cursor-pointer bg-white"
          >
            <option value="">Day Scholar (No Bus)</option>
            {stations.map(s => {
              const feeAmount = parseFloat(s.amount || s.amount === 0 ? s.amount : 0);
              return (
                <option key={s.id || s.station} value={s.station}>
                  {s.station} (₹{feeAmount.toFixed(0)})
                </option>
              );
            })}
          </select>
        </div>

        {/* Previous Session Balance */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Previous Balance (Dues)</label>
          <input
            type="number"
            placeholder="e.g. 1500 (0 if none)"
            value={formData.previousSessionDues}
            onChange={(e) => setFormData({ ...formData, previousSessionDues: e.target.value })}
            className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D] bg-slate-50/50"
          />
        </div>

        {/* Upfront Initial Amount Collected */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Initial Amount Collected</label>
          <input
            type="number"
            placeholder="e.g. 5000 (0 if none)"
            value={formData.initialAmountPaid}
            onChange={(e) => setFormData({ ...formData, initialAmountPaid: e.target.value })}
            className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D] bg-slate-50/50"
          />
        </div>

        {/* Payment Mode */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Payment Mode (Upfront)</label>
          <select
            value={formData.paymentMode}
            onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
            className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none cursor-pointer bg-white"
          >
            <option value="CASH">CASH</option>
            <option value="UPI">UPI</option>
            <option value="BANK_TRANSFER">BANK TRANSFER</option>
          </select>
        </div>
      </div>

      {/* Concessions Accordion / Collapsible */}
      <div className="border-t border-slate-100 pt-4 mt-2">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#093C5D] mb-3">Fee Concessions & Discounts (Monthly Override)</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Tuition Discount (₹)</label>
            <input
              type="number"
              placeholder="0"
              value={formData.discountTuition}
              onChange={(e) => setFormData({ ...formData, discountTuition: e.target.value })}
              className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D] bg-slate-50/50"
            />
          </div>
          <div>
            <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Bus Fee Discount (₹)</label>
            <input
              type="number"
              placeholder="0"
              value={formData.discountBus}
              onChange={(e) => setFormData({ ...formData, discountBus: e.target.value })}
              className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D] bg-slate-50/50"
            />
          </div>
          <div>
            <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Admission Discount (₹)</label>
            <input
              type="number"
              placeholder="0"
              value={formData.discountAdmission}
              onChange={(e) => setFormData({ ...formData, discountAdmission: e.target.value })}
              className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D] bg-slate-50/50"
            />
          </div>
          <div>
            <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Annual Fee Discount (₹)</label>
            <input
              type="number"
              placeholder="0"
              value={formData.discountAnnual}
              onChange={(e) => setFormData({ ...formData, discountAnnual: e.target.value })}
              className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D] bg-slate-50/50"
            />
          </div>
          <div>
            <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Exam Fee Discount (₹)</label>
            <input
              type="number"
              placeholder="0"
              value={formData.discountExam}
              onChange={(e) => setFormData({ ...formData, discountExam: e.target.value })}
              className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D] bg-slate-50/50"
            />
          </div>
          <div>
            <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Computer Fee Discount (₹)</label>
            <input
              type="number"
              placeholder="0"
              value={formData.discountComputer}
              onChange={(e) => setFormData({ ...formData, discountComputer: e.target.value })}
              className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D] bg-slate-50/50"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <button
          type="submit"
          disabled={submitLoading}
          className="px-5 py-2.5 bg-[#093C5D] hover:bg-[#001F42] text-white rounded-xl text-xs font-bold transition border-0 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
        >
          {submitLoading && <Loader2 className="animate-spin" size={13} />}
          Register Student
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition border-0 cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
