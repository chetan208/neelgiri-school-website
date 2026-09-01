'use client';

import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  CreditCard,
  Search,
  Users,
  Calendar,
  Phone,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Info,
  DollarSign,
  PlusCircle,
  Settings2,
  UserPlus,
  BookOpen,
  Printer,
  Edit2,
  MessageSquare,
  BarChart3
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { printInvoice } from "./printInvoice";
import FeeDefaultsSettings from "./FeeDefaultsSettings";
import FeeAutomationSettings from "./FeeAutomationSettings";
import StudentRegistrationForm from "../../components/sections/admin/StudentRegistrationForm";

export default function FeePortal({ 
  preselectedStudent, 
  clearPreselected, 
  selectedSession,
  setActiveModule
}: { 
  preselectedStudent?: any; 
  clearPreselected?: () => void; 
  selectedSession: string;
  setActiveModule?: (id: string | null) => void;
}) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "add-student" | "class-config" | "automation" | "analysis">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);


  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentFees, setStudentFees] = useState<any[]>([]);
  const [feesLoading, setFeesLoading] = useState(false);
  const [stations, setStations] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  // Loadings
  const [searchLoading, setSearchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  // Analysis states
  const [analysisData, setAnalysisData] = useState<any[]>([]);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [selectedAnalysisMonth, setSelectedAnalysisMonth] = useState<string>("");
  const [unpaidSearch, setUnpaidSearch] = useState("");
  const [unpaidClassFilter, setUnpaidClassFilter] = useState("All");

  // Modals & Feedback
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentTargetFee, setPaymentTargetFee] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState<any>(null);
  const [pendingListTab, setPendingListTab] = useState<"prev" | "current">("prev");

  // Payment Modal state
  const [paymentForm, setPaymentForm] = useState({
    amountPaid: "",
    paymentMode: "CASH" as "CASH" | "UPI"
  });

  // Detailed breakdown view state
  const [showDetailedFees, setShowDetailedFees] = useState(false);

  // Edit Fee Modal state
  const [editingFee, setEditingFee] = useState<any | null>(null);
  const [editFeeForm, setEditFeeForm] = useState({
    admissionFee: "",
    tuitionFee: "",
    schoolBusCharges: "",
    examFee: "",
    computerFee: "",
    ptmFine: "",
    tieBeltBooks: "",
    buildingFund: "",
    annualCharges: "",
    previousSessionDues: ""
  });

  // Add Student Form State
  const [studentForm, setStudentForm] = useState({
    name: "",
    className: "",
    admissionDate: "",
    dob: "",
    fatherName: "",
    motherName: "",
    cardNo: "",
    contactNo: "",
    station: "",
    sessionYear: "2026-2027",
    initialAmountPaid: "",
    paymentMode: "CASH" as "CASH" | "UPI"
  });

  // Class Config Form State
  const [classForm, setClassForm] = useState({
    className: "",
    monthName: "",
    admissionFee: "",
    tuitionFee: "",
    examFee: "",
    computerFee: "",
    tieBeltBooks: ""
  });

  const [monthlyClassFees, setMonthlyClassFees] = useState<any[]>([]);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

  useEffect(() => {
    fetchStations();
    fetchClasses();
    fetchMonthlyClassFees();
  }, []);

  useEffect(() => {
    if (activeTab === "analysis") {
      const fetchAnalysis = async () => {
        setAnalysisLoading(true);
        setError(null);
        try {
          const res = await axios.get(`${SERVER_URL}/api/erp/fees/income-analysis`, {
            params: { session: selectedSession },
            withCredentials: true
          });
          if (res.data.success) {
            setAnalysisData(res.data.data);
            if (res.data.data.length > 0) {
              const now = new Date();
              const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
              const currentMonthName = `${monthNames[now.getMonth()]}-${now.getFullYear()}`;
              const hasCurrentMonth = res.data.data.some((d: any) => d.month === currentMonthName);
              if (hasCurrentMonth) {
                setSelectedAnalysisMonth(currentMonthName);
              } else {
                setSelectedAnalysisMonth(res.data.data[0].month); // Default to the first month in sorted order
              }
            } else {
              setSelectedAnalysisMonth("");
            }
          }
        } catch (err) {
          console.error("Error fetching income analysis:", err);
          setError("Failed to fetch income analysis data.");
        } finally {
          setAnalysisLoading(false);
        }
      };
      fetchAnalysis();
    }
  }, [activeTab, selectedSession]);

  useEffect(() => {
    const fetchMonthlyFee = async () => {
      if (!classForm.className || !classForm.monthName) return;
      try {
        const res = await axios.get(
          `${SERVER_URL}/api/erp/classes/monthly-fees?className=${encodeURIComponent(classForm.className)}&monthName=${encodeURIComponent(classForm.monthName)}`, 
          { withCredentials: true }
        );
        if (res.data.success && res.data.fees && res.data.fees.length > 0) {
          const config = res.data.fees[0];
          setClassForm(prev => ({
            ...prev,
            admissionFee: config.admissionFee.toString(),
            tuitionFee: config.tuitionFee.toString(),
            examFee: config.examFee.toString(),
            computerFee: config.computerFee.toString(),
            tieBeltBooks: (config.tieBeltBooks || 0).toString()
          }));
        } else {
          setClassForm(prev => ({
            ...prev,
            admissionFee: "",
            tuitionFee: "",
            examFee: "",
            computerFee: "",
            tieBeltBooks: ""
          }));
        }
      } catch (err) {
        console.error("Error fetching monthly config:", err);
      }
    };
    fetchMonthlyFee();
  }, [classForm.className, classForm.monthName, SERVER_URL]);

  useEffect(() => {
    fetchStats();
    setStudentForm(prev => ({ ...prev, sessionYear: selectedSession }));
  }, [selectedSession]);

  useEffect(() => {
    if (preselectedStudent) {
      handleSelectStudent(preselectedStudent);
      if (clearPreselected) clearPreselected();
    }
  }, [preselectedStudent]);

  // Click outside search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchStations = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/erp/stations`, { withCredentials: true });
      if (res.data.success) {
        setStations(res.data.stations);
      }
    } catch (err) {
      console.error("Error fetching stations:", err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/erp/classes`, { withCredentials: true });
      if (res.data.success) {
        setClasses(res.data.classes);
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  const fetchMonthlyClassFees = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/erp/classes/monthly-fees`, { withCredentials: true });
      if (res.data.success) {
        setMonthlyClassFees(res.data.fees);
      }
    } catch (err) {
      console.error("Error fetching monthly class fees:", err);
    }
  };



  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await axios.get(`${SERVER_URL}/api/erp/fees/stats`, {
        params: { session: selectedSession },
        withCredentials: true
      });
      if (res.data.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const searchStudents = async (query: string) => {
    if (!query) {
      setStudents([]);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await axios.get(`${SERVER_URL}/api/erp/students`, {
        params: { search: query, limit: 10, session: selectedSession },
        withCredentials: true
      });
      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (err) {
      console.error("Error searching students:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSoftRefresh = () => {
    fetchStations();
    fetchClasses();
    fetchMonthlyClassFees();
    fetchStats();
    if (selectedStudent) {
      handleSelectStudent(selectedStudent);
    } else {
      setSearchQuery("");
      setStudents([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchStudents(query);
    setShowDropdown(true);
  };

  const handleSelectStudent = async (student: any) => {
    setSelectedStudent(student);
    setSearchQuery(student.name);
    setShowDropdown(false);
    setFeesLoading(true);
    try {
      const res = await axios.get(`${SERVER_URL}/api/erp/students/${student.id}/fees`, { withCredentials: true });
      if (res.data.success) {
        setStudentFees(res.data.student.feeStructures);
      }
    } catch (err) {
      console.error("Error loading student fees:", err);
    } finally {
      setFeesLoading(false);
    }
  };

  const handleOpenCollectPayment = (fee?: any) => {
    if (fee) {
      setPaymentTargetFee(fee);
      const paid = fee.payments?.reduce((s: number, p: any) => s + parseFloat(p.amountPaid), 0) ?? 0;
      const remaining = parseFloat(fee.total) - paid;
      setPaymentForm({
        amountPaid: remaining > 0 ? remaining.toFixed(2) : "",
        paymentMode: "CASH"
      });
    } else {
      setPaymentTargetFee(null);
      setPaymentForm({ amountPaid: "", paymentMode: "CASH" });
    }
    setShowPaymentModal(true);
  };

  const handleCollectPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !paymentForm.amountPaid) return;

    setSubmitLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post(`${SERVER_URL}/api/erp/make-payment`, {
        studentId: selectedStudent.id,
        amountPaid: parseFloat(paymentForm.amountPaid),
        paymentMode: paymentForm.paymentMode,
        feeStructureId: paymentTargetFee?.id || undefined
      }, { withCredentials: true });

      if (res.data.success) {
        setSuccess(`Payment of ₹${paymentForm.amountPaid} collected successfully.`);
        setShowPaymentModal(false);
        setPaymentTargetFee(null);
        setPaymentForm({ amountPaid: "", paymentMode: "CASH" });
        // Reload student data & stats
        handleSelectStudent(selectedStudent);
        fetchStats();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to make payment.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...studentForm,
        initialAmountPaid: studentForm.initialAmountPaid ? parseFloat(studentForm.initialAmountPaid) : 0
      };
      const res = await axios.post(`${SERVER_URL}/api/erp/student`, payload, { withCredentials: true });
      if (res.data.success) {
        setSuccess(`Student ${studentForm.name} registered and fee structures generated successfully.`);
        setStudentForm({
          name: "",
          className: "",
          admissionDate: "",
          dob: "",
          fatherName: "",
          motherName: "",
          cardNo: "",
          contactNo: "",
          station: "",
          sessionYear: selectedSession,
          initialAmountPaid: "",
          paymentMode: "CASH"
        });
        fetchStats();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add student. Ensure card number is unique for this session.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSaveClassConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.monthName) {
      setError("Please select a month for the configuration.");
      return;
    }
    setSubmitLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        className: classForm.className,
        monthName: classForm.monthName,
        admissionFee: parseFloat(classForm.admissionFee || "0"),
        tuitionFee: parseFloat(classForm.tuitionFee || "0"),
        examFee: parseFloat(classForm.examFee || "0"),
        computerFee: parseFloat(classForm.computerFee || "0"),
        tieBeltBooks: parseFloat(classForm.tieBeltBooks || "0")
      };
      const res = await axios.post(`${SERVER_URL}/api/erp/classes/monthly-fees`, payload, { withCredentials: true });
      if (res.data.success) {
        setSuccess(`Class ${classForm.className} fees for ${classForm.monthName} configured successfully.`);
        setClassForm({
          className: "",
          monthName: "",
          admissionFee: "",
          tuitionFee: "",
          examFee: "",
          computerFee: "",
          tieBeltBooks: ""
        });
        fetchMonthlyClassFees();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to configure class fees.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOpenEditFee = (fee: any) => {
    setEditingFee(fee);
    setEditFeeForm({
      admissionFee: fee.admissionFee.toString(),
      tuitionFee: fee.tuitionFee.toString(),
      schoolBusCharges: fee.schoolBusCharges.toString(),
      examFee: fee.examFee.toString(),
      computerFee: fee.computerFee.toString(),
      ptmFine: fee.ptmFine.toString(),
      tieBeltBooks: fee.tieBeltBooks.toString(),
      buildingFund: fee.buildingFund.toString(),
      annualCharges: fee.annualCharges.toString(),
      previousSessionDues: (fee.previousSessionDues || 0).toString()
    });
  };

  const handleSaveFeeUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFee) return;
    setSubmitLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.put(`${SERVER_URL}/api/erp/students/fees/${editingFee.id}`, {
        admissionFee: parseFloat(editFeeForm.admissionFee || "0"),
        tuitionFee: parseFloat(editFeeForm.tuitionFee || "0"),
        schoolBusCharges: parseFloat(editFeeForm.schoolBusCharges || "0"),
        examFee: parseFloat(editFeeForm.examFee || "0"),
        computerFee: parseFloat(editFeeForm.computerFee || "0"),
        ptmFine: parseFloat(editFeeForm.ptmFine || "0"),
        tieBeltBooks: parseFloat(editFeeForm.tieBeltBooks || "0"),
        buildingFund: parseFloat(editFeeForm.buildingFund || "0"),
        annualCharges: parseFloat(editFeeForm.annualCharges || "0"),
        previousSessionDues: parseFloat(editFeeForm.previousSessionDues || "0")
      }, { withCredentials: true });

      if (res.data.success) {
        setSuccess(`Fee structure for ${editingFee.month} updated successfully.`);
        setEditingFee(null);
        // Refresh student data & stats
        handleSelectStudent(selectedStudent);
        fetchStats();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update fee structure.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 border border-slate-200/50 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <CreditCard className="text-[#093C5D]" size={22} />
          <div>
            <h2 className="text-base font-black text-[#093C5D] leading-none">Fee Management Portal</h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Manage, collect, and configure fees</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button 
            onClick={handleSoftRefresh}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-[#093C5D] px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer text-xs font-bold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Refresh Data
          </button>
          
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Academic Session:</span>
            <span className="text-xs font-bold text-[#093C5D]">{selectedSession}</span>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200/60 p-0.5 space-x-1 bg-slate-100 rounded-2xl w-full sm:w-fit overflow-x-auto">
        <button
          onClick={() => { setActiveTab("dashboard"); setError(null); setSuccess(null); }}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold border-0 cursor-pointer transition ${
            activeTab === "dashboard" ? "bg-[#093C5D] text-white shadow-sm" : "text-slate-500 hover:text-[#093C5D] bg-transparent"
          }`}
        >
          <DollarSign size={14} />
          Dashboard
        </button>
        <button
          onClick={() => { setActiveTab("add-student"); setError(null); setSuccess(null); }}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold border-0 cursor-pointer transition ${
            activeTab === "add-student" ? "bg-[#093C5D] text-white shadow-sm" : "text-slate-500 hover:text-[#093C5D] bg-transparent"
          }`}
        >
          <UserPlus size={14} />
          Add Student
        </button>
        <button
          onClick={() => { setActiveTab("class-config"); setError(null); setSuccess(null); }}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold border-0 cursor-pointer transition ${
            activeTab === "class-config" ? "bg-[#093C5D] text-white shadow-sm" : "text-slate-500 hover:text-[#093C5D] bg-transparent"
          }`}
        >
          <Settings2 size={14} />
          Configurations
        </button>
        <button
          onClick={() => { setActiveTab("automation"); setError(null); setSuccess(null); }}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold border-0 cursor-pointer transition ${
            activeTab === "automation" ? "bg-[#093C5D] text-white shadow-sm" : "text-slate-500 hover:text-[#093C5D] bg-transparent"
          }`}
        >
          <Printer size={14} />
          Generate Fees
        </button>
        <button
          onClick={() => { setActiveTab("analysis"); setError(null); setSuccess(null); }}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold border-0 cursor-pointer transition ${
            activeTab === "analysis" ? "bg-[#093C5D] text-white shadow-sm" : "text-slate-500 hover:text-[#093C5D] bg-transparent"
          }`}
        >
          <BarChart3 size={14} />
          Income Analysis
        </button>
      </div>

      {/* Feedback Alert banners */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 text-xs font-bold">
            <AlertTriangle size={15} className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-bold">
            <CheckCircle2 size={15} className="shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Tab viewport */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-[#093C5D]/5 border border-[#093C5D]/10 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#093C5D]/10 text-[#093C5D] flex items-center justify-center">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-lg font-black text-[#093C5D] tracking-tight">{statsLoading ? "..." : stats?.totalStudents ?? 0}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Students in Session</p>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <p className="text-lg font-black text-amber-800 tracking-tight">{statsLoading ? "..." : stats?.currentPendingCount ?? 0}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Current Month Pending</p>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <p className="text-lg font-black text-rose-800 tracking-tight">{statsLoading ? "..." : stats?.prevPendingCount ?? 0}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Previous Months Pending</p>
                </div>
              </div>
            </div>

            {/* Main Interactive Student Ledger Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              {!selectedStudent ? (
                <>
                  {/* Left Column: Student Search & Pending List */}
                  <div className="lg:col-span-5 space-y-5">
                    <div className="space-y-1.5 relative" ref={searchContainerRef}>
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Search Student Ledger</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter Student Name or Card No..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                          className="w-full pl-9 pr-4 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D]"
                        />
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={13} />
                        {searchLoading && (
                          <Loader2 className="absolute right-3 top-2.5 text-slate-400 animate-spin" size={13} />
                        )}
                      </div>
                      
                      {/* Dropdown Suggestions */}
                      {showDropdown && students.length > 0 && (
                        <div className="absolute left-0 right-0 z-20 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                          {students.map((st) => (
                            <button
                              key={st.id}
                              onClick={() => handleSelectStudent(st)}
                              className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition border-0 border-b border-slate-100 last:border-b-0 cursor-pointer flex items-center justify-between text-xs"
                            >
                              <div>
                                <p className="font-bold text-[#093C5D]">{st.name}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Class: {st.studentclass?.className} | Father: {st.fatherName}</p>
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Roll No: {st.cardNo}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pending Student lists */}
                    <div className="border border-slate-200/50 rounded-2xl overflow-hidden bg-slate-50">
                      <div className="flex border-b border-slate-200/50">
                        <button
                          onClick={() => setPendingListTab("prev")}
                          className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider border-0 cursor-pointer transition ${
                            pendingListTab === "prev" ? "bg-white text-rose-600 border-b-2 border-rose-600" : "bg-transparent text-slate-500"
                          }`}
                        >
                          Prev Pending ({stats?.prevPendingCount ?? 0})
                        </button>
                        <button
                          onClick={() => setPendingListTab("current")}
                          className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider border-0 cursor-pointer transition ${
                            pendingListTab === "current" ? "bg-white text-amber-600 border-b-2 border-amber-600" : "bg-transparent text-slate-500"
                          }`}
                        >
                          Current Pending ({stats?.currentPendingCount ?? 0})
                        </button>
                      </div>

                      <div className="max-h-60 overflow-y-auto p-2 space-y-1.5">
                        {statsLoading ? (
                          <div className="text-center py-8 text-xs font-semibold text-slate-400">Loading pending lists...</div>
                        ) : (pendingListTab === "prev" ? stats?.prevPendingList : stats?.currentPendingList)?.length === 0 ? (
                          <div className="text-center py-8 text-xs font-semibold text-slate-400">No pending student records found.</div>
                        ) : (pendingListTab === "prev" ? stats?.prevPendingList : stats?.currentPendingList)?.map((st: any) => (
                          <button
                            key={st.id}
                            onClick={() => handleSelectStudent(st)}
                            className="w-full text-left p-3 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition flex justify-between items-center cursor-pointer bg-transparent"
                          >
                            <div>
                              <p className="text-xs font-bold text-[#093C5D]">{st.name}</p>
                              <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Card No: {st.cardNo} | {st.studentclass?.className}</p>
                            </div>
                            <span className="text-xs font-black text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-lg">₹{st.pendingAmount}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Ledger Matrix and Actions Placeholder */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="h-64 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-6 text-slate-400 bg-slate-50/50">
                      <CreditCard size={28} className="text-slate-300 mb-3" />
                      <h4 className="text-xs font-bold text-slate-500">No Student Ledger Loaded</h4>
                      <p className="text-[10px] text-slate-400 max-w-xs mt-1">Search for a student on the left panel or click a student from the pending list to view their monthly fee ledger matrix.</p>
                    </div>
                  </div>
                </>
              ) : (
                /* Full Width Ledger Workspace when student is selected */
                <div className="lg:col-span-12 space-y-5">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 p-4 border border-slate-200/50 rounded-2xl">
                    <div className="w-full sm:max-w-md relative" ref={searchContainerRef}>
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Search Another Student</label>
                      <div className="relative mt-1">
                        <input
                          type="text"
                          placeholder="Enter Student Name or Card No..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                          className="w-full pl-9 pr-4 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D]"
                        />
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={13} />
                        {searchLoading && (
                          <Loader2 className="absolute right-3 top-2.5 text-slate-400 animate-spin" size={13} />
                        )}
                      </div>
                      
                      {/* Dropdown Suggestions */}
                      {showDropdown && students.length > 0 && (
                        <div className="absolute left-0 right-0 z-20 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                          {students.map((st) => (
                            <button
                              key={st.id}
                              onClick={() => handleSelectStudent(st)}
                              className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition border-0 border-b border-slate-100 last:border-b-0 cursor-pointer flex items-center justify-between text-xs"
                            >
                              <div>
                                <p className="font-bold text-[#093C5D]">{st.name}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Class: {st.studentclass?.className} | Father: {st.fatherName}</p>
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Roll No: {st.cardNo}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => { setSelectedStudent(null); setSearchQuery(""); }}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl border-0 cursor-pointer transition active:scale-95"
                      >
                        Back to Pending List
                      </button>

                      {setActiveModule && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStudent(null);
                            setSearchQuery("");
                            setActiveModule("students");
                          }}
                          className="px-4 py-2 bg-[#FA6781] hover:bg-[#fa5370] text-white text-xs font-bold rounded-xl border-0 cursor-pointer transition active:scale-95 flex items-center gap-1.5 shadow-sm shadow-[#FA6781]/15"
                        >
                          <ArrowLeft size={13} />
                          Back to Student Management
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Student Info Card */}
                  <div className="bg-gradient-to-r from-[#093C5D] to-[#0c4e79] text-white p-5 rounded-2xl shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full blur-xl -mr-6 -mt-6" />
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-black tracking-tight leading-none">{selectedStudent.name}</h3>
                        <p className="text-[10px] text-slate-200 font-bold mt-1.5">
                          Father: {selectedStudent.fatherName} | Contact: {selectedStudent.contactNo}
                        </p>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#59B292] bg-[#59B292]/20 border border-[#59B292]/30 px-3 py-1 rounded-full">
                        {selectedStudent.studentclass?.className || selectedStudent.studentClass}
                      </span>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-200">Roll Number/Card No: <strong className="text-white">{selectedStudent.cardNo}</strong></span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowDetailedFees(!showDetailedFees)}
                          className="bg-[#093C5D]/30 border border-white/15 hover:bg-[#093C5D]/50 text-white font-black text-[10px] uppercase tracking-wider px-3 py-2 rounded-xl transition cursor-pointer active:scale-95"
                        >
                          {showDetailedFees ? "Hide Detailed Fees" : "Show Detailed Fees"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenCollectPayment()}
                          className="bg-[#59B292] hover:bg-[#439678] text-white font-black text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl transition border-0 cursor-pointer active:scale-95"
                        >
                          Collect Fees
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Ledger Table */}
                  <div className="border border-slate-200/60 rounded-2xl overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-xs font-semibold">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200/60 text-[#093C5D]">
                            <th className="p-3 text-[10px] font-black uppercase tracking-wider">Month</th>
                            {showDetailedFees && <th className="p-3 text-[10px] font-black uppercase tracking-wider">Admission</th>}
                            <th className="p-3 text-[10px] font-black uppercase tracking-wider">Tuition</th>
                            {showDetailedFees && <th className="p-3 text-[10px] font-black uppercase tracking-wider">Exam</th>}
                            {showDetailedFees && <th className="p-3 text-[10px] font-black uppercase tracking-wider">Computer</th>}
                            <th className="p-3 text-[10px] font-black uppercase tracking-wider">Transport</th>
                            {showDetailedFees && <th className="p-3 text-[10px] font-black uppercase tracking-wider">PTM Fine</th>}
                            {showDetailedFees && <th className="p-3 text-[10px] font-black uppercase tracking-wider">Tie & Belt</th>}
                            {showDetailedFees && <th className="p-3 text-[10px] font-black uppercase tracking-wider">Building</th>}
                            {showDetailedFees && <th className="p-3 text-[10px] font-black uppercase tracking-wider">Annual</th>}
                            {!showDetailedFees && <th className="p-3 text-[10px] font-black uppercase tracking-wider">Other</th>}
                            <th className="p-3 text-[10px] font-black uppercase tracking-wider font-serif">Total</th>
                            <th className="p-3 text-[10px] font-black uppercase tracking-wider">Paid</th>
                            <th className="p-3 text-[10px] font-black uppercase tracking-wider">Date</th>
                            <th className="p-3 text-[10px] font-black uppercase tracking-wider">Prev Balance</th>
                            <th className="p-3 text-[10px] font-black uppercase tracking-wider">Current Balance</th>
                            <th className="p-3 text-[10px] font-black uppercase tracking-wider">Total Balance</th>
                            <th className="p-3 text-[10px] font-black uppercase tracking-wider">Status</th>
                            <th className="p-3 text-right text-[10px] font-black uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                          {feesLoading ? (
                            <tr>
                              <td colSpan={showDetailedFees ? 18 : 12} className="text-center py-10 text-slate-400">Loading ledger data...</td>
                            </tr>
                          ) : studentFees.length === 0 ? (
                            <tr>
                              <td colSpan={showDetailedFees ? 18 : 12} className="text-center py-10 text-slate-400">No generated fee structures found.</td>
                            </tr>
                          ) : (() => {
                            // Sort fees chronologically
                            const parseMonthStr = (str: string) => {
                              if (!str) return new Date(0);
                              const [mName, year] = str.split("-");
                              return new Date(`${mName} 1, ${year}`);
                            };

                            const sortedFees = [...studentFees].sort((a: any, b: any) => {
                              return parseMonthStr(a.month).getTime() - parseMonthStr(b.month).getTime();
                            });

                            // Calculate running balances
                            let runningDues = 0;
                            const feesWithBalances = sortedFees.map((fee: any) => {
                              const paid = fee.payments?.reduce((s: number, p: any) => s + parseFloat(p.amountPaid), 0) ?? 0;
                              const prevSessionDues = parseFloat(fee.previousSessionDues || "0") || 0;
                              const actualTotal = parseFloat(fee.total) - prevSessionDues;
                              const currentRemaining = actualTotal - paid;
                              const prevRemaining = runningDues + prevSessionDues;
                              runningDues = Math.round((runningDues + prevSessionDues + currentRemaining) * 100) / 100;
                              
                              return {
                                ...fee,
                                paid,
                                actualTotal,
                                currentRemaining,
                                prevRemaining,
                                totalBalance: runningDues
                              };
                            });

                            return feesWithBalances.map((fee) => {
                              const payments = fee.payments || [];
                              const latestPay = payments.length > 0
                                ? new Date(Math.max(...payments.map((p: any) => new Date(p.date || p.createdAt).getTime())))
                                : null;
                              const latestPayStr = latestPay
                                ? latestPay.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
                                : "—";

                              const other = 
                                parseFloat(fee.admissionFee || "0") + 
                                parseFloat(fee.examFee || "0") + 
                                parseFloat(fee.computerFee || "0") + 
                                parseFloat(fee.ptmFine || "0") + 
                                parseFloat(fee.tieBeltBooks || "0") + 
                                parseFloat(fee.buildingFund || "0") + 
                                parseFloat(fee.annualCharges || "0");

                              return (
                                <tr key={fee.id} className="hover:bg-slate-50/50 transition">
                                  <td className="p-3 font-bold text-[#093C5D]">{fee.month}</td>
                                  {showDetailedFees && <td className="p-3">₹{fee.admissionFee}</td>}
                                  <td className="p-3">₹{fee.tuitionFee}</td>
                                  {showDetailedFees && <td className="p-3">₹{fee.examFee}</td>}
                                  {showDetailedFees && <td className="p-3">₹{fee.computerFee}</td>}
                                  <td className="p-3">₹{fee.schoolBusCharges}</td>
                                  {showDetailedFees && <td className="p-3">₹{fee.ptmFine}</td>}
                                  {showDetailedFees && <td className="p-3">₹{fee.tieBeltBooks}</td>}
                                  {showDetailedFees && <td className="p-3">₹{fee.buildingFund}</td>}
                                  {showDetailedFees && <td className="p-3">₹{fee.annualCharges}</td>}
                                  {!showDetailedFees && <td className="p-3">₹{other.toFixed(2)}</td>}
                                  <td className="p-3 font-bold text-slate-700">₹{fee.actualTotal}</td>
                                  <td className="p-3 text-emerald-600 font-bold">₹{fee.paid.toFixed(2)}</td>
                                  <td className="p-3 font-medium text-slate-500">{latestPayStr}</td>
                                  <td className="p-3 text-amber-600 font-bold">₹{fee.prevRemaining.toFixed(2)}</td>
                                  <td className="p-3 text-rose-500 font-bold">₹{fee.currentRemaining.toFixed(2)}</td>
                                  <td className="p-3 text-rose-700 font-black">₹{fee.totalBalance.toFixed(2)}</td>
                                  <td className="p-3">
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                      fee.status === "PAID" 
                                        ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                                        : fee.status === "PARTIALLY_PAID"
                                        ? "bg-amber-50 border-amber-200 text-amber-700"
                                        : "bg-rose-50 border-rose-200 text-rose-700"
                                    }`}>
                                      {fee.status}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      {fee.currentRemaining > 0 && (
                                        <button
                                          type="button"
                                          onClick={() => handleOpenCollectPayment(fee)}
                                          title="Collect Monthly Fee"
                                          className="p-1.5 rounded-lg border border-emerald-200 text-emerald-600 hover:text-white hover:bg-emerald-500 transition cursor-pointer bg-emerald-50"
                                        >
                                          <DollarSign size={13} />
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => handleOpenEditFee(fee)}
                                        title="Edit Fee"
                                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#093C5D] hover:bg-slate-100 transition cursor-pointer bg-white"
                                      >
                                        <Edit2 size={13} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => printInvoice(selectedStudent, fee, studentFees)}
                                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#093C5D] hover:bg-slate-100 transition cursor-pointer bg-white"
                                      >
                                        <Printer size={13} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>

                    {/* Summary Bar inside the Ledger table container */}
                    {studentFees.length > 0 && (
                      <div className="bg-[#093C5D] text-white p-4 flex flex-wrap items-center justify-between gap-4 font-bold text-xs sticky bottom-0 z-10 shadow-lg border-t border-[#FA6781]/20">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Student Ledger Summary</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-wider text-slate-300">Total Billing</span>
                            <span className="text-sm font-black">
                              ₹{studentFees.reduce((sum: number, fee: any) => sum + parseFloat(fee.total), 0).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-wider text-slate-300">Total Paid</span>
                            <span className="text-sm font-black text-emerald-400">
                              ₹{studentFees.reduce((sum: number, fee: any) => sum + (fee.payments?.reduce((s: number, p: any) => s + parseFloat(p.amountPaid), 0) ?? 0), 0).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-wider text-slate-300">Total Remaining</span>
                            <span className="text-sm font-black text-[#FA6781]">
                              ₹{(
                                studentFees.reduce((sum: number, fee: any) => sum + parseFloat(fee.total), 0) -
                                studentFees.reduce((sum: number, fee: any) => sum + (fee.payments?.reduce((s: number, p: any) => s + parseFloat(p.amountPaid), 0) ?? 0), 0)
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Student Tab */}
        {activeTab === "add-student" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="text-sm font-black text-[#093C5D] mb-1">Student Registration & Monthly Setup</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Registering a student automatically generates monthly fee structures based on their admission date.</p>
            </div>

            <StudentRegistrationForm
              selectedSession={selectedSession}
              classes={classes}
              stations={stations}
              onSuccess={(studentName) => {
                fetchStats();
              }}
            />
          </div>
        )}

        {/* Defaults Configuration Tab */}
        {activeTab === "class-config" && (
          <FeeDefaultsSettings selectedSession={selectedSession} />
        )}

        {/* Automation Settings Tab */}
        {activeTab === "automation" && (
          <FeeAutomationSettings />
        )}

        {/* Income Analysis Tab */}
        {activeTab === "analysis" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black text-[#093C5D] mb-1">Session Income & Class Analysis</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Track fee demand, collections, and pending balances class-by-class for each billing month of the current session.</p>
            </div>

            {analysisLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="animate-spin text-[#093C5D]" size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Analysis Data...</span>
              </div>
            ) : analysisData.length === 0 ? (
              <div className="py-16 text-center text-slate-400 italic text-xs">
                No fee billing structures found for this session.
              </div>
            ) : (() => {
              const monthData = analysisData.find(d => d.month === selectedAnalysisMonth);
              return (
                <div className="space-y-6">
                  {/* Month selection sub-tabs */}
                  <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
                    {analysisData.map((d: any) => {
                      const isActive = selectedAnalysisMonth === d.month;
                      return (
                        <button
                          key={d.month}
                          onClick={() => setSelectedAnalysisMonth(d.month)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition cursor-pointer active:scale-95 ${
                            isActive
                              ? "bg-[#093C5D] text-white border-[#093C5D] shadow-sm"
                              : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {d.month}
                        </button>
                      );
                    })}
                  </div>

                  {monthData ? (
                    <div className="space-y-6">
                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-[#093C5D]/5 border border-[#093C5D]/10 rounded-2xl p-5 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#093C5D]/10 text-[#093C5D] flex items-center justify-center font-bold">₹</div>
                          <div>
                            <p className="text-lg font-black text-[#093C5D] tracking-tight">₹{(monthData.cumulativeDemand ?? monthData.totalDemand).toLocaleString("en-IN")}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total Demand</p>
                          </div>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">₹</div>
                          <div>
                            <p className="text-lg font-black text-emerald-800 tracking-tight">₹{monthData.totalPaid.toLocaleString("en-IN")}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Collected Income</p>
                          </div>
                        </div>

                        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">₹</div>
                          <div>
                            <p className="text-lg font-black text-rose-800 tracking-tight">₹{Math.max(0, (monthData.cumulativeDemand ?? monthData.totalDemand) - monthData.totalPaid).toLocaleString("en-IN")}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Pending Balance</p>
                          </div>
                        </div>
                      </div>

                      {/* Class-wise Breakdown Table */}
                      <div className="border border-slate-200/60 rounded-2xl overflow-hidden bg-white">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-left text-xs font-semibold">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200/60 text-[#093C5D]">
                                <th className="p-3 text-[10px] font-black uppercase tracking-wider">Class</th>
                                <th className="p-3 text-[10px] font-black uppercase tracking-wider text-center">Students</th>
                                <th className="p-3 text-[10px] font-black uppercase tracking-wider">Prev Dues</th>
                                <th className="p-3 text-[10px] font-black uppercase tracking-wider">Current Dues</th>
                                <th className="p-3 text-[10px] font-black uppercase tracking-wider">Total</th>
                                <th className="p-3 text-[10px] font-black uppercase tracking-wider">Collected</th>
                                <th className="p-3 text-[10px] font-black uppercase tracking-wider">Pending</th>
                                <th className="p-3 text-[10px] font-black uppercase tracking-wider">Student Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-650">
                              {monthData.classes.map((cls: any) => {
                                const cumDemand = cls.cumulativeDemand ?? cls.demand;
                                const prevDues = Math.max(0, cumDemand - cls.demand);
                                const totalPending = Math.max(0, cumDemand - cls.paid);
                                return (
                                  <tr key={cls.className} className="hover:bg-slate-50/50 transition">
                                    <td className="p-3 font-bold text-[#093C5D]">{cls.className}</td>
                                    <td className="p-3 text-center text-slate-500 font-bold">{cls.studentCount}</td>
                                    <td className="p-3 text-amber-600 font-bold">₹{prevDues.toLocaleString("en-IN")}</td>
                                    <td className="p-3 text-slate-700 font-bold">₹{cls.demand.toLocaleString("en-IN")}</td>
                                    <td className="p-3 text-[#093C5D] font-black">₹{cumDemand.toLocaleString("en-IN")}</td>
                                    <td className="p-3 text-emerald-600 font-bold">₹{cls.paid.toLocaleString("en-IN")}</td>
                                    <td className="p-3 text-rose-500 font-bold">₹{totalPending.toLocaleString("en-IN")}</td>
                                    <td className="p-3">
                                      <div className="flex items-center gap-1.5">
                                        <span className="inline-flex px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-emerald-50 border border-emerald-200 text-emerald-700" title="Fully Paid">
                                          {cls.paidCount} P
                                        </span>
                                        <span className="inline-flex px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-amber-50 border border-amber-200 text-amber-700" title="Partially Paid">
                                          {cls.partialCount} R
                                        </span>
                                        <span className="inline-flex px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-rose-50 border border-rose-200 text-rose-700" title="Unpaid / Pending">
                                          {cls.pendingCount} U
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Unpaid Students List */}
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="text-xs font-black text-rose-700 uppercase tracking-wider">Unpaid Students ({monthData.unpaidStudents?.length || 0})</h4>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Students who have pending or partially paid dues for {selectedAnalysisMonth}.</p>
                          </div>
                          
                          {/* Search and class filters */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <input
                              type="text"
                              placeholder="Search by name or card..."
                              value={unpaidSearch}
                              onChange={(e) => setUnpaidSearch(e.target.value)}
                              className="px-3 py-1.5 text-[11px] font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D] w-full sm:w-48 bg-slate-50/50"
                            />
                            <select
                              value={unpaidClassFilter}
                              onChange={(e) => setUnpaidClassFilter(e.target.value)}
                              className="px-3 py-1.5 text-[11px] font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none cursor-pointer bg-white"
                            >
                              <option value="All">All Classes</option>
                              {classes.map(c => (
                                <option key={c.id} value={c.className}>{c.className}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Filtered list table */}
                        {(() => {
                          const filtered = (monthData.unpaidStudents || []).filter((st: any) => {
                            const matchSearch = 
                              st.name.toLowerCase().includes(unpaidSearch.toLowerCase()) ||
                              st.cardNo.toLowerCase().includes(unpaidSearch.toLowerCase());
                            const matchClass = 
                              unpaidClassFilter === "All" || 
                              st.className === unpaidClassFilter;
                            return matchSearch && matchClass;
                          });

                          return filtered.length === 0 ? (
                            <div className="py-8 text-center text-slate-450 italic text-[11px] bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                              No unpaid students found matching your filters.
                            </div>
                          ) : (
                            <div className="border border-slate-200/50 rounded-2xl overflow-hidden bg-white max-h-[400px] overflow-y-auto">
                              <table className="w-full border-collapse text-left text-xs font-semibold">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-200/50 text-[#093C5D] sticky top-0 z-10">
                                    <th className="p-3 text-[10px] font-black uppercase tracking-wider">Card No.</th>
                                    <th className="p-3 text-[10px] font-black uppercase tracking-wider">Name</th>
                                    <th className="p-3 text-[10px] font-black uppercase tracking-wider">Class</th>
                                    <th className="p-3 text-[10px] font-black uppercase tracking-wider">Dues Demand</th>
                                    <th className="p-3 text-[10px] font-black uppercase tracking-wider">Paid</th>
                                    <th className="p-3 text-[10px] font-black uppercase tracking-wider">Pending</th>
                                    <th className="p-3 text-[10px] font-black uppercase tracking-wider">Status</th>
                                    <th className="p-3 text-[10px] font-black uppercase tracking-wider">Contact</th>
                                    <th className="p-3 text-[10px] font-black uppercase tracking-wider text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-655">
                                  {filtered.map((st: any) => (
                                    <tr key={st.id} className="hover:bg-rose-50/10 transition">
                                      <td className="p-3 font-mono font-bold text-slate-500">{st.cardNo}</td>
                                      <td className="p-3 font-bold text-[#093C5D]">{st.name}</td>
                                      <td className="p-3 uppercase text-slate-400">{st.className}</td>
                                      <td className="p-3 text-slate-600">₹{st.demand}</td>
                                      <td className="p-3 text-emerald-600 font-bold">₹{st.paid}</td>
                                      <td className="p-3 text-rose-500 font-black">₹{st.pending}</td>
                                      <td className="p-3">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                          st.status === "PARTIALLY_PAID"
                                            ? "bg-amber-50 border-amber-200 text-amber-700"
                                            : "bg-rose-50 border-rose-200 text-rose-700"
                                        }`}>
                                          {st.status === "PARTIALLY_PAID" ? "Partial" : "Unpaid"}
                                        </span>
                                      </td>
                                      <td className="p-3 text-slate-500 font-bold">{st.contactNo || "—"}</td>
                                      <td className="p-3 text-right">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            handleSelectStudent(st);
                                            setActiveTab("dashboard");
                                          }}
                                          className="px-2.5 py-1 bg-[#093C5D]/10 hover:bg-[#093C5D] hover:text-white text-[#093C5D] border border-[#093C5D]/20 text-[10px] font-black uppercase tracking-wider rounded-lg transition cursor-pointer"
                                        >
                                          Open Ledger
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div className="py-10 text-center text-slate-400 italic text-xs">
                      No details found for the selected month.
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Collect Fee Modal */}
      {showPaymentModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-xl space-y-5 relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 border-0 bg-transparent cursor-pointer p-1"
            >
              <X size={15} />
            </button>

            <div>
              <h3 className="text-sm font-black text-[#093C5D] leading-none">
                {paymentTargetFee ? `Collect Fee - ${paymentTargetFee.month}` : "Collect Payments"}
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">
                {paymentTargetFee 
                  ? `Clear specific monthly fee for ${selectedStudent.name}`
                  : `Allocate payment sequentially for ${selectedStudent.name}`}
              </p>
            </div>

            <form onSubmit={handleCollectPayment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Amount to Collect (₹)</label>
                <input
                  type="number"
                  required
                  step="any"
                  max={paymentTargetFee ? (parseFloat(paymentTargetFee.total) - (paymentTargetFee.payments?.reduce((s: number, p: any) => s + parseFloat(p.amountPaid), 0) ?? 0)) : undefined}
                  placeholder="e.g. 1500"
                  value={paymentForm.amountPaid}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, amountPaid: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D]"
                />
                {paymentTargetFee && (
                  <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                    Maximum collectable: ₹{(parseFloat(paymentTargetFee.total) - (paymentTargetFee.payments?.reduce((s: number, p: any) => s + parseFloat(p.amountPaid), 0) ?? 0)).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Payment Mode</label>
                <select
                  value={paymentForm.paymentMode}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentMode: e.target.value as "CASH" | "UPI" }))}
                  className="w-full px-3 py-2 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none cursor-pointer bg-white"
                >
                  <option value="CASH">CASH</option>
                  <option value="UPI">UPI (Digital Scan)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className="w-full py-2.5 bg-[#59B292] hover:bg-[#439678] text-white rounded-xl text-xs font-bold transition border-0 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                {submitLoading && <Loader2 className="animate-spin" size={13} />}
                Confirm Collection
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Fee Structure Modal */}
      {editingFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-xl space-y-5 relative"
          >
            <button
              onClick={() => setEditingFee(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 border-0 bg-transparent cursor-pointer p-1"
            >
              <X size={15} />
            </button>

            <div>
              <h3 className="text-sm font-black text-[#093C5D] leading-none">Edit Dues - {editingFee.month}</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Modify monthly dues for {selectedStudent.name}</p>
            </div>

            <form onSubmit={handleSaveFeeUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Admission Fee (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={editFeeForm.admissionFee}
                    onChange={(e) => setEditFeeForm(prev => ({ ...prev, admissionFee: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Tuition Fee (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={editFeeForm.tuitionFee}
                    onChange={(e) => setEditFeeForm(prev => ({ ...prev, tuitionFee: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Bus Charges (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={editFeeForm.schoolBusCharges}
                    onChange={(e) => setEditFeeForm(prev => ({ ...prev, schoolBusCharges: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Exam Fee (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={editFeeForm.examFee}
                    onChange={(e) => setEditFeeForm(prev => ({ ...prev, examFee: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Computer Fee (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={editFeeForm.computerFee}
                    onChange={(e) => setEditFeeForm(prev => ({ ...prev, computerFee: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">PTM Fine (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={editFeeForm.ptmFine}
                    onChange={(e) => setEditFeeForm(prev => ({ ...prev, ptmFine: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Tie & Belt (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={editFeeForm.tieBeltBooks}
                    onChange={(e) => setEditFeeForm(prev => ({ ...prev, tieBeltBooks: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Building Fund (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={editFeeForm.buildingFund}
                    onChange={(e) => setEditFeeForm(prev => ({ ...prev, buildingFund: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Annual Dues (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={editFeeForm.annualCharges}
                    onChange={(e) => setEditFeeForm(prev => ({ ...prev, annualCharges: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Previous Dues (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={editFeeForm.previousSessionDues}
                    onChange={(e) => setEditFeeForm(prev => ({ ...prev, previousSessionDues: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D]"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFee(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-5 py-2 bg-[#093C5D] hover:bg-[#001F42] text-white rounded-xl text-xs font-bold transition border-0 cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  {submitLoading && <Loader2 className="animate-spin" size={13} />}
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
