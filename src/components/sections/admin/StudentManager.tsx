'use client';

import React, { useState, useEffect } from "react";
import { Plus, Search, Loader2, CheckCircle2, AlertTriangle, X, Users, UserPlus, Calendar, CreditCard, Bus, User, ArrowLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

interface StudentType {
  id: string;
  name: string;
  studentClass: string;
  fatherName: string;
  motherName: string;
  dateOfAdmission: string;
  dob?: string;
  cardNo: string;
  contactNo: string;
  station?: string | null;
  studentclass?: {
    className: string;
  };
  session?: {
    year: string;
  };
}

interface StudentManagerProps {
  onManageFees?: (student: StudentType) => void;
  selectedSession?: string;
}

const CLASSES_LIST = [
  "Nursery", "LKG", "UKG",
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "Class 11", "Class 12"
];

export default function StudentManager({ onManageFees, selectedSession }: StudentManagerProps) {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<StudentType | null>(null);
  const [stations, setStations] = useState<any[]>([]);

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
    paymentMode: "CASH"
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [promoteLoading, setPromoteLoading] = useState(false);
  const [promoteStudentData, setPromoteStudentData] = useState<StudentType | null>(null);

  const getNextClass = (currentClass: string) => {
    const CLASS_PROGRESSION: Record<string, string> = {
      "Nursery": "LKG",
      "LKG": "UKG",
      "UKG": "1st",
      "1st": "2nd",
      "2nd": "3rd",
      "3rd": "4th",
      "4th": "5th",
      "5th": "6th",
      "6th": "7th",
      "7th": "8th",
      "8th": "9th",
      "9th": "10th",
      "10th": "11th",
      "11th": "12th"
    };
    return CLASS_PROGRESSION[currentClass] || null;
  };

  const getNextSession = (currentSession: string) => {
    const parts = currentSession.split("-");
    if (parts.length === 2) {
      const startYear = parseInt(parts[0]);
      const endYearShort = parseInt(parts[1]);
      const nextStartYear = startYear + 1;
      const nextEndYearShort = endYearShort + 1;
      const nextEndYearShortStr = String(nextEndYearShort).padStart(2, '0').slice(-2);
      return `${nextStartYear}-${nextEndYearShortStr}`;
    }
    const yearNum = parseInt(currentSession);
    if (!isNaN(yearNum)) {
      return `${yearNum + 1}`;
    }
    return currentSession;
  };

  const handleOpenPromote = (student: StudentType) => {
    setPromoteStudentData(student);
    setShowPromoteModal(true);
    setError(null);
    setSuccess(null);
  };

  const handlePromote = async () => {
    if (!promoteStudentData) return;
    setPromoteLoading(true);
    setError(null);
    setSuccess(null);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
    try {
      const currentClass = promoteStudentData.studentclass?.className || promoteStudentData.studentClass || "";
      const currentSession = promoteStudentData.session?.year || selectedSession || "";
      
      const res = await axios.post(`${SERVER_URL}/api/erp/students/${promoteStudentData.id}/promote`, {}, { withCredentials: true });
      if (res.data.success) {
        setSuccess(res.data.message || `Student promoted successfully to class ${getNextClass(currentClass)} for session ${getNextSession(currentSession)}.`);
        setShowPromoteModal(false);
        setSelectedStudentForDetail(null);
        fetchStudents(searchQuery, currentPage, selectedClass, selectedSession);
      }
    } catch (err: any) {
      console.error("Error promoting student:", err);
      setError(err.response?.data?.message || "Failed to promote student.");
    } finally {
      setPromoteLoading(false);
    }
  };

  const [editFormData, setEditFormData] = useState({
    name: "",
    studentClass: "",
    fatherName: "",
    motherName: "",
    dateOfAdmission: "",
    dob: "",
    cardNo: "",
    contactNo: "",
    station: ""
  });


  const fetchStudents = async (query = "", page = 1, cls = selectedClass, sess = selectedSession) => {
    setLoading(true);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
    try {
      const res = await axios.get(`${SERVER_URL}/api/erp/students`, {
        params: { search: query, page, limit: 10, studentClass: cls, session: sess },
        withCredentials: true
      });
      if (res.data && res.data.students) {
        setStudents(res.data.students);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
          setTotalCount(res.data.pagination.totalCount || 0);
          setCurrentPage(res.data.pagination.currentPage || 1);
        } else {
          setTotalPages(1);
          setTotalCount(res.data.students.length);
          setCurrentPage(1);
        }
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(searchQuery, 1, selectedClass, selectedSession);
  }, [searchQuery, selectedClass, selectedSession]);

  const [dbClasses, setDbClasses] = useState<any[]>([]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
        const [stationsRes, classesRes] = await Promise.all([
          axios.get(`${SERVER_URL}/api/erp/stations`, { withCredentials: true }),
          axios.get(`${SERVER_URL}/api/erp/classes`, { withCredentials: true })
        ]);
        if (stationsRes.data.success) setStations(stationsRes.data.stations);
        if (classesRes.data.success) setDbClasses(classesRes.data.classes);
      } catch (err) {
        console.error("Error fetching dropdowns:", err);
      }
    };
    fetchDropdowns();
  }, []);

  const handlePageChange = (page: number) => {
    fetchStudents(searchQuery, page, selectedClass, selectedSession);
  };

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
      paymentMode: "CASH"
    });
    setError(null);
    setSuccess(null);
  };

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
        paymentMode: formData.paymentMode
      };
      await axios.post(`${SERVER_URL}/api/erp/student`, payload, { withCredentials: true });
      setSuccess(`${formData.name} registered successfully!`);
      resetForm();
      setShowForm(false);
      fetchStudents(searchQuery, 1, selectedClass, selectedSession);
    } catch (err: any) {
      console.error("Error in registering student:", err);
      setError(err.response?.data?.message || "Failed to register student. Check if card number is unique.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOpenEdit = (student: StudentType) => {
    const formatDateForInput = (dateStr?: string | null) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().split("T")[0];
    };

    setEditFormData({
      name: student.name || "",
      studentClass: student.studentclass?.className || student.studentClass || "",
      fatherName: student.fatherName || "",
      motherName: student.motherName || "",
      dateOfAdmission: formatDateForInput(student.dateOfAdmission),
      dob: formatDateForInput(student.dob),
      cardNo: student.cardNo || "",
      contactNo: student.contactNo || "",
      station: student.station || ""
    });
    setError(null);
    setSuccess(null);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForDetail) return;
    setSubmitLoading(true);
    setError(null);
    setSuccess(null);

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

    try {
      const payload = {
        name: editFormData.name,
        className: editFormData.studentClass,
        admissionDate: editFormData.dateOfAdmission,
        fatherName: editFormData.fatherName,
        motherName: editFormData.motherName,
        dob: editFormData.dob || null,
        cardNo: editFormData.cardNo,
        contactNo: editFormData.contactNo,
        station: editFormData.station,
        sessionYear: selectedSession
      };
      const res = await axios.put(`${SERVER_URL}/api/erp/students/${selectedStudentForDetail.id}`, payload, { withCredentials: true });
      if (res.data.success) {
        setSuccess(`Student information updated successfully!`);
        setShowEditModal(false);
        setSelectedStudentForDetail(res.data.student);
        fetchStudents(searchQuery, currentPage, selectedClass, selectedSession);
      }
    } catch (err: any) {
      console.error("Error in updating student:", err);
      setError(err.response?.data?.message || "Failed to update student profile. Check if card number is unique.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudentForDetail) return;
    setSubmitLoading(true);
    setError(null);
    setSuccess(null);

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

    try {
      const res = await axios.delete(`${SERVER_URL}/api/erp/students/${selectedStudentForDetail.id}`, { withCredentials: true });
      if (res.data.success) {
        setSuccess(`Student deleted successfully!`);
        setShowDeleteConfirm(false);
        setSelectedStudentForDetail(null);
        fetchStudents(searchQuery, 1, selectedClass, selectedSession);
      }
    } catch (err: any) {
      console.error("Error deleting student:", err);
      setError(err.response?.data?.message || "Failed to delete student.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {selectedStudentForDetail ? (
        <div className="w-full space-y-6">
          {/* Breadcrumb / Back button */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#093C5D] border-b border-slate-100 pb-3">
            <button
              onClick={() => setSelectedStudentForDetail(null)}
              className="text-slate-400 hover:text-[#093C5D] transition cursor-pointer border-0 bg-transparent p-0 flex items-center gap-1"
            >
              <ArrowLeft size={13} /> Student Database
            </button>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-[#FA6781]">{selectedStudentForDetail.name}</span>
          </div>

          {/* Detailed Profile View */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200/60 shadow-md overflow-hidden"
          >
            {/* Top banner with Gradient and Avatar */}
            <div className="bg-gradient-to-r from-[#093C5D] to-[#0c4e79] text-white p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
              <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#59B292]/10 rounded-full blur-xl -ml-16 -mb-16" />

              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-3xl font-black uppercase text-white shadow-inner relative z-10 shrink-0">
                {selectedStudentForDetail.name?.charAt(0)}
              </div>

              {/* Title / Primary Info */}
              <div className="text-center sm:text-left relative z-10 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#59B292]">Student Profile</span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                  {selectedStudentForDetail.name}
                </h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-200 mt-1 font-semibold">
                  <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">
                    Class: {selectedStudentForDetail.studentclass?.className || selectedStudentForDetail.studentClass}
                  </span>
                  <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">
                    Card No: {selectedStudentForDetail.cardNo}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Body */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Block: Academic & Transport */}
              <div className="space-y-5">
                <h3 className="text-xs font-black text-[#093C5D] uppercase tracking-widest border-b border-slate-100 pb-2">
                  Academic & Enrollment
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Class Name</p>
                    <p className="font-bold text-[#093C5D] mt-1">{selectedStudentForDetail.studentclass?.className || selectedStudentForDetail.studentClass}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Admission / Card Number</p>
                    <p className="font-mono font-bold text-[#093C5D] mt-1">{selectedStudentForDetail.cardNo}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Date of Admission</p>
                    <p className="font-bold text-[#093C5D] mt-1 flex items-center gap-1.5 text-slate-650">
                      <Calendar size={13} className="text-slate-400" />
                      {new Date(selectedStudentForDetail.dateOfAdmission).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Transport Route / Bus Station</p>
                    <p className="font-bold text-[#093C5D] mt-1 flex items-center gap-1.5 text-slate-650">
                      <Bus size={13} className="text-slate-400" />
                      {selectedStudentForDetail.station || "Day Scholar / None"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Block: Personal & Parents details */}
              <div className="space-y-5">
                <h3 className="text-xs font-black text-[#093C5D] uppercase tracking-widest border-b border-slate-100 pb-2">
                  Personal & Family Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Date of Birth (DOB)</p>
                    <p className="font-bold text-[#093C5D] mt-1 flex items-center gap-1.5 text-slate-650">
                      <Calendar size={13} className="text-slate-400" />
                      {selectedStudentForDetail.dob ? new Date(selectedStudentForDetail.dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Not Specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Contact Number</p>
                    <p className="font-bold text-[#093C5D] mt-1">{selectedStudentForDetail.contactNo}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Father's Name</p>
                    <p className="font-bold text-[#093C5D] mt-1">Mr. {selectedStudentForDetail.fatherName}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Mother's Name</p>
                    <p className="font-bold text-[#093C5D] mt-1">Mrs. {selectedStudentForDetail.motherName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-start">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForDetail(null)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-255 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition duration-200 cursor-pointer border-0 active:scale-95"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(selectedStudentForDetail)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-[#093C5D] border border-[#093C5D]/25 rounded-xl text-xs font-bold transition duration-200 cursor-pointer active:scale-95"
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenPromote(selectedStudentForDetail)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-250 rounded-xl text-xs font-bold transition duration-200 cursor-pointer active:scale-95"
                >
                  Promote Student
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition duration-200 cursor-pointer active:scale-95"
                >
                  Delete Student
                </button>
              </div>

              <button
                type="button"
                onClick={() => onManageFees?.(selectedStudentForDetail)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#14B8A6] hover:bg-[#FA6781] text-white rounded-xl text-xs font-bold transition duration-200 cursor-pointer border-0 shadow-md shadow-[#14B8A6]/10 active:scale-95"
              >
                <CreditCard size={14} />
                Go to Fee Management & Ledger
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        <>
          {/* Header Block */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-[#093C5D]">Student Database</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Manage and register students enrolled at Neelgiri Public School.</p>
            </div>
            <button
              onClick={() => { setShowForm(!showForm); resetForm(); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#093C5D] hover:bg-[#FA6781] text-white rounded-xl text-xs font-bold transition duration-200 cursor-pointer border-0 shadow-md shadow-[#093C5D]/10"
            >
              {showForm ? <X size={14} /> : <UserPlus size={14} />}
              {showForm ? "Cancel Registration" : "Register New Student"}
            </button>
          </div>

          {/* Expandable Registration Form */}
          {showForm && (
            <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xs animate-in slide-in-from-top-4 duration-300">
              <h3 className="text-sm font-black text-[#093C5D] mb-4 flex items-center gap-2">
                <UserPlus size={16} className="text-[#FA6781]" />
                Student Admission Form
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., Chetan Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Student Class</label>
                    <select
                      required
                      value={formData.studentClass}
                      onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                    >
                      <option value="" disabled>Select Class</option>
                      {dbClasses.map(c => (
                        <option key={c.id} value={c.className}>{c.className}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Father's Name</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., Mr. Rajesh Sharma"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Mother's Name</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., Mrs. Sunita Sharma"
                      value={formData.motherName}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Admission Date</label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfAdmission}
                      onChange={(e) => setFormData({ ...formData, dateOfAdmission: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                    />
                  </div>

                   <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={formData.dob || ""}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                    />
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Contact Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="E.g., 9876543210"
                        value={formData.contactNo}
                        onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Bus Station (Optional)</label>
                      <select
                        value={formData.station}
                        onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                      >
                        <option value="">None / Day Scholar</option>
                        {stations.map(s => (
                          <option key={s.station} value={s.station}>{s.station}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Initial Amount Collected (Upfront Deposit)</label>
                      <input
                        type="number"
                        placeholder="e.g. 5000 (0 if none)"
                        value={formData.initialAmountPaid}
                        onChange={(e) => setFormData(prev => ({ ...prev, initialAmountPaid: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Payment Mode</label>
                      <select
                        value={formData.paymentMode}
                        onChange={(e) => setFormData(prev => ({ ...prev, paymentMode: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                      >
                        <option value="CASH">CASH</option>
                        <option value="UPI">UPI</option>
                        <option value="BANK_TRANSFER">BANK TRANSFER</option>
                      </select>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
                    <AlertTriangle size={15} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#59B292] hover:bg-[#489d7f] text-white rounded-xl text-xs font-bold transition duration-200 cursor-pointer border-0 shadow-md shadow-[#59B292]/10"
                >
                  {submitLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  {submitLoading ? "Registering..." : "Add Student"}
                </button>
              </form>
            </div>
          )}

          {/* Success Notification */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-4 py-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} />
                <span>{success}</span>
              </div>
              <button onClick={() => setSuccess(null)} className="text-emerald-500 hover:text-emerald-700 border-0 bg-transparent cursor-pointer">
                <X size={15} />
              </button>
            </div>
          )}

          {/* Student List View */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
            {/* Search Filter Header */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-50/50">
              <div className="flex flex-col sm:flex-row gap-3 flex-1 items-stretch sm:items-center">
                {/* Search Input */}
                <div className="relative flex-1 max-w-sm">
                  <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, card, or phone number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D] transition-all font-semibold"
                  />
                </div>

                {/* Class filter Dropdown */}
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl w-full sm:w-auto">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#093C5D]">Filter Class:</span>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="bg-transparent border-0 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Classes</option>
                    {dbClasses.map((c) => (
                      <option key={c.id} value={c.className}>{c.className}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                <Users size={13} />
                <span className="font-bold">{totalCount}</span> students found
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="animate-spin text-[#093C5D]" size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Student Records...</span>
                </div>
              ) : students.length > 0 ? (
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400">
                      <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Student Details</th>
                      <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Card Number</th>
                      <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Family details</th>
                      <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Admission Date</th>
                      <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Contact</th>
                      <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => setSelectedStudentForDetail(student)}
                            className="font-black text-[#093C5D] hover:text-[#FA6781] transition cursor-pointer border-0 bg-transparent p-0 text-left"
                          >
                            {student.name}
                          </button>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{student.studentclass?.className || student.studentClass}</p>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-[11px] font-semibold text-slate-500">
                          {student.cardNo}
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-slate-500 font-medium">F: {student.fatherName}</p>
                          <p className="text-slate-400 text-[11px]">M: {student.motherName}</p>
                        </td>
                        <td className="px-5 py-3.5 flex items-center gap-1.5 text-slate-400 font-medium">
                          <Calendar size={12} />
                          {new Date(student.dateOfAdmission).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-600">
                          {student.contactNo}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedStudentForDetail(student)}
                              title="View Details"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#093C5D] hover:bg-[#FA6781] text-white rounded-xl text-[10px] font-bold transition duration-200 cursor-pointer border-0 shadow-sm shadow-[#093C5D]/10"
                            >
                              <User size={12} />
                              View Profile
                            </button>
                            <button
                              onClick={() => onManageFees?.(student)}
                              title="Manage Fees"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#14B8A6] hover:bg-[#FA6781] text-white rounded-xl text-[10px] font-bold transition duration-200 cursor-pointer border-0 shadow-sm shadow-[#14B8A6]/10"
                            >
                              <CreditCard size={12} />
                              Manage Fees
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-16 text-center text-slate-400 italic">
                  No students found matching your search.
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/30 text-xs text-slate-500">
                <div>
                  Showing <span className="font-bold">{(currentPage - 1) * 10 + 1}</span> to{" "}
                  <span className="font-bold">{Math.min(currentPage * 10, totalCount)}</span> of{" "}
                  <span className="font-bold">{totalCount}</span> records
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#093C5D]/30 disabled:opacity-50 disabled:hover:border-slate-200 font-bold rounded-lg transition duration-150 cursor-pointer disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((p, index, arr) => {
                      return (
                        <React.Fragment key={p}>
                          {index > 0 && arr[index - 1] !== p - 1 && <span className="px-1 text-slate-400">...</span>}
                          <button
                            onClick={() => handlePageChange(p)}
                            className={`px-3 py-1.5 border rounded-lg font-bold transition duration-150 cursor-pointer ${
                              currentPage === p
                                ? "bg-[#093C5D] text-white border-[#093C5D] shadow-xs"
                                : "bg-white border-slate-200 text-slate-600 hover:border-[#093C5D]/30"
                            }`}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      );
                    })}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#093C5D]/30 disabled:opacity-50 disabled:hover:border-slate-200 font-bold rounded-lg transition duration-150 cursor-pointer disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl relative my-8 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowEditModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-650 bg-transparent border-0 cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-sm font-black text-[#093C5D] mb-4 flex items-center gap-2">
              Edit Student Details
            </h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Student Class</label>
                  <select
                    required
                    value={editFormData.studentClass}
                    onChange={(e) => setEditFormData({ ...editFormData, studentClass: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                  >
                    <option value="" disabled>Select Class</option>
                    {dbClasses.map(c => (
                      <option key={c.id} value={c.className}>{c.className}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Father's Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.fatherName}
                    onChange={(e) => setEditFormData({ ...editFormData, fatherName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Mother's Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.motherName}
                    onChange={(e) => setEditFormData({ ...editFormData, motherName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Admission Date</label>
                  <input
                    type="date"
                    required
                    value={editFormData.dateOfAdmission}
                    onChange={(e) => setEditFormData({ ...editFormData, dateOfAdmission: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={editFormData.dob}
                    onChange={(e) => setEditFormData({ ...editFormData, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Admission / Card No (Unique)</label>
                  <input
                    type="text"
                    required
                    value={editFormData.cardNo}
                    onChange={(e) => setEditFormData({ ...editFormData, cardNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Contact Number</label>
                  <input
                    type="tel"
                    required
                    value={editFormData.contactNo}
                    onChange={(e) => setEditFormData({ ...editFormData, contactNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Bus Station (Optional)</label>
                  <select
                    value={editFormData.station}
                    onChange={(e) => setEditFormData({ ...editFormData, station: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#093C5D] focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                  >
                    <option value="">None / Day Scholar</option>
                    {stations.map(s => (
                      <option key={s.station} value={s.station}>{s.station}</option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
                  <AlertTriangle size={15} />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold transition cursor-pointer border-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-5 py-2 bg-[#093C5D] hover:bg-[#0b4870] text-white rounded-xl text-xs font-bold transition disabled:bg-slate-300 cursor-pointer border-0 flex items-center gap-1.5"
                >
                  {submitLoading ? <Loader2 size={13} className="animate-spin" /> : null}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-black text-rose-600 mb-3 flex items-center gap-2">
              <AlertTriangle size={20} />
              Confirm Student Deletion
            </h3>
            
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              Are you sure you want to permanently delete <strong className="text-slate-800">{selectedStudentForDetail?.name}</strong>?
            </p>
            <p className="text-xs text-slate-500 leading-relaxed mt-2 bg-rose-50 border border-rose-100 p-3 rounded-xl font-bold">
              This action will permanently delete all associated fee structures, monthly demands, payment history, and logs from the database. This cannot be undone.
            </p>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
                <AlertTriangle size={15} />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => { setShowDeleteConfirm(false); setError(null); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold transition cursor-pointer border-0"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteStudent}
                disabled={submitLoading}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition disabled:bg-slate-300 cursor-pointer border-0 flex items-center gap-1.5"
              >
                {submitLoading ? <Loader2 size={13} className="animate-spin" /> : null}
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promote Student Modal */}
      {showPromoteModal && promoteStudentData && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200/60 max-w-md w-full p-6 shadow-2xl relative my-8 animate-in zoom-in-95 duration-200 text-slate-800 space-y-4">
            <button
              onClick={() => {
                setShowPromoteModal(false);
                setError(null);
                setSuccess(null);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-650 border-0 bg-transparent cursor-pointer p-1"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#093C5D]">Promote Student</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Move Student to Next Academic Session</p>
              </div>
            </div>

            <div className="space-y-3 leading-relaxed text-xs">
              <p className="font-semibold text-slate-600">
                You are promoting <strong className="text-[#093C5D] font-black">{promoteStudentData.name}</strong> to the next academic session.
              </p>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Current State</p>
                  <p className="text-xs font-black text-slate-700 mt-1">
                    Class: {promoteStudentData.studentclass?.className || promoteStudentData.studentClass}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                    Session: {promoteStudentData.session?.year || selectedSession}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-500">
                    Roll No: {promoteStudentData.cardNo}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-emerald-600">Target State</p>
                  {getNextClass(promoteStudentData.studentclass?.className || promoteStudentData.studentClass || "") ? (
                    <>
                      <p className="text-xs font-black text-emerald-700 mt-1">
                        Class: {getNextClass(promoteStudentData.studentclass?.className || promoteStudentData.studentClass || "")}
                      </p>
                      <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">
                        Session: {getNextSession(promoteStudentData.session?.year || selectedSession || "")}
                      </p>
                      <p className="text-[10px] font-semibold text-emerald-500 italic mt-0.5">
                        Roll No: Auto-generated
                      </p>
                    </>
                  ) : (
                    <p className="text-xs font-black text-rose-600 mt-1">
                      Highest class (12th) reached.
                    </p>
                  )}
                </div>
              </div>

              {getNextClass(promoteStudentData.studentclass?.className || promoteStudentData.studentClass || "") ? (
                <div className="bg-emerald-50/50 border border-emerald-100 text-emerald-800 p-3.5 rounded-2xl text-[10px] font-semibold leading-normal font-sans">
                  <strong>Note:</strong> Promoting this student will automatically create the next academic session if it does not already exist, assign the student to that session in the promoted class, auto-generate a new roll number, and set up their monthly fees. The student's current session record will remain untouched.
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3.5 rounded-2xl text-[10px] font-semibold leading-normal font-sans">
                  <strong>Warning:</strong> Student is currently in the highest class (12th). They cannot be promoted further. If they are leaving the school, you can archive or delete them.
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
                <AlertTriangle size={15} />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPromoteModal(false);
                  setError(null);
                  setSuccess(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold transition cursor-pointer border-0"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePromote}
                disabled={promoteLoading || !getNextClass(promoteStudentData.studentclass?.className || promoteStudentData.studentClass || "")}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer border-0 flex items-center gap-1.5 shadow-md shadow-emerald-600/10"
              >
                {promoteLoading ? <Loader2 size={13} className="animate-spin" /> : null}
                Confirm Promotion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
